# Documentación — Biblioteca Inteligente

 ## Índice

1. [Estructura del proyecto](#1-estructura-del-proyecto)
2. [Backend](#2-backend)
   - [Rutas de la API](#21-rutas-de-la-api)
   - [Flujo de autenticación](#22-flujo-de-autenticación)
   - [Flujo de envío de correos](#23-flujo-de-envío-de-correos)
   - [Flujo de cambio de contraseña](#24-flujo-de-cambio-de-contraseña)
   - [Conexión a la base de datos](#25-conexión-a-la-base-de-datos)
   - [Manejo de errores](#26-manejo-de-errores)
3. [Frontend](#3-frontend)
   - [Rutas del frontend](#31-rutas-del-frontend)
   - [Arquitectura](#32-arquitectura)
   - [Componentes (pantallas)](#33-componentes-pantallas)
4. [Problemas conocidos](#4-problemas-conocidos)
5. [Cambios recientes](#5-cambios-recientes)

---

## 1. Estructura del proyecto

```
biblo/
├── .git/
├── postman/                          → Colecciones de Postman para pruebas
├── DOCUMENTACION.md                  ← Este archivo
│
├── backend_bibloteca/                → Servidor Express
│   ├── .env                          → Variables de entorno
│   ├── package.json
│   ├── config/
│   │   ├── environment.js            → Lee .env y exporta objeto ENVIRONMENT
│   │   └── email_config.js           → Inicializa cliente Resend
│   ├── postman/
│   │   └── nuevo_libro.postman_collection.json
│   └── src/
│       ├── main.js                   → Punto de entrada: Express, CORS, rutas, DB, listen
│       ├── db/
│       │   └── connect.js            → Conexión Mongoose con fallback a MongoDB en memoria
│       ├── end_point/                → Routers de Express (uno por recurso)
│       │   ├── Autor.js              → GET /:autor
│       │   ├── cambiar_contraseña.js → POST /solicitar, POST /, POST /restablecer
│       │   ├── confir_email.js       → POST /
│       │   ├── favoritos.js          → GET /, POST /:libroId, DELETE /:libroId
│       │   ├── id.js                 → GET /:id
│       │   ├── login.js              → POST /
│       │   ├── mis_libros.js         → GET /
│       │   ├── nuevo_libros.js       → POST /
│       │   └── nuevo_usuario.js      → POST /
│       ├── esquemas/                 → Modelos de Mongoose
│       │   ├── esquema_libro.js
│       │   └── esquema_usuario.js
│       ├── helpers/
│       │   ├── email_cambio_contraseña.js  → Envía email de restablecimiento
│       │   ├── email_confirmacion.js       → Envía email de confirmación de cuenta
│       │   └── error_class.js              → Clase ServerError
│       ├── midleware/                → Middlewares de Express
│       │   ├── autenticacion.js      → Verifica JWT Bearer token
│       │   ├── error_handler.js      → Manejador global de errores
│       │   ├── libros_autenticador.js→ Busca libro por nombre desde el body
│       │   └── verificar_usuario.js  → Busca usuario por email desde el body
│       └── servicios/
│           └── buscador_libros.js    → POST / - busca libro por nombre
│
└── frontend/                         → Aplicación React + Vite
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
    └── src/
        ├── main.tsx                  → Renderiza <App> dentro de <BrowserRouter>
        ├── App.tsx                   → AuthProvider + definición de rutas
        ├── index.css                 → Estilos globales (tema "biblioteca clásica")
        ├── assets/                   → hero.png, react.svg, vite.svg
        ├── context/
        │   └── AuthContext.jsx       → Contexto de autenticación (token, usuario, login, logout)
        ├── fetch/                    → Llamadas a la API
        │   ├── authFetch.js          → Módulo central de fetch con JWT y refresh automático
        │   ├── fetch_nuevo_usuario.js
        │   ├── fetch_nuevo_libro.js
        │   ├── fetch_libros.js
        │   ├── fetch_favoritos.js
        │   ├── fetch_cambio_contraseña.js
        │   └── fetche_confirmacion_mail.js
        ├── helpers/
        │   └── error_class.js        → Clase backendError
        └── pantallas/                → Componentes de página
            ├── Pantalla_principal.jsx
            ├── Iniciar_sesion.jsx
            ├── nuevo_usuario.jsx
            ├── Nuevo_libro.jsx
            ├── Perfil.jsx
            ├── Buscador.jsx
            ├── MisLibros.jsx
            ├── Favoritos.jsx
            └── Cambiar_contraseña.jsx
```

---

## 2. Backend

### 2.1 Rutas de la API

Todas las rutas se montan en `src/main.js` con prefijo base `app.use()`.

| Ruta base | Archivo | Endpoints | Auth |
|---|---|---|---|
| `/app/bibilo/nuevo_usuario` | `nuevo_usuario.js` | `POST /` | No |
| `/app/bibilo/verificacion` | `confir_email.js` | `POST /` | No |
| `/app/bibilo/login` | `login.js` | `POST /` | No |
| `/app/bibilo/nuevo_libro` | `nuevo_libros.js` | `POST /` | JWT |
| `/app/bibilo/mis-libros` | `mis_libros.js` | `GET /` | JWT |
| `/app/bibilo/favoritos` | `favoritos.js` | `GET /`, `POST /:libroId`, `DELETE /:libroId` | JWT |
| `/app/bibilo/buscador` | `buscador_libros.js` | `POST /` | No |
| `/app/bibilo/cambiar-contrasena` | `cambiar_contraseña.js` | `POST /solicitar`, `POST /`, `POST /restablecer` | Variable |
| `/app/bibilo/autor/` | `Autor.js` | `GET /:autor` | No |
| `/app/bibilo/` | `id.js` | `GET /:id` | No |

**Detalle de endpoints de `cambiar-contrasena`:**
- `POST /solicitar` — Requiere `{ email }`. Middleware `verificarUsuario` busca el email en DB. Envía correo con link de restablecimiento.
- `POST /` — Requiere `{ contraseñaActual, nuevaContraseña }`. Usuario autenticado. Cambia la contraseña con la actual como verificación.
- `POST /restablecer` — Requiere `{ token, nuevaContraseña }`. Verifica el JWT, busca al usuario por email, actualiza la contraseña.

### 2.2 Flujo de autenticación

1. **Registro**: Formulario en `nuevo_usuario.jsx` → `POST /app/bibilo/nuevo_usuario` → backend hashea contraseña con bcrypt, guarda en MongoDB, envía correo de confirmación.
2. **Login**: Formulario en `Iniciar_sesion.jsx` → `POST /app/bibilo/login` → backend verifica email+contraseña con bcrypt, devuelve JWT (payload: `{ id, email, nombre, role }`, expira en 15 min) + refreshToken (7d). Frontend llama a `AuthContext.login()` que ejecuta `setToken(resultado.token)` y `actualizarToken(resultado.token)` para sincronizar con `authFetch.js`.
3. **Sesión**: `AuthContext` hidrata estado desde localStorage al montar. `estaAutenticado` deriva de `!!token`. El token se sincroniza automáticamente con `authFetch.js` mediante un `useEffect` que llama a `actualizarToken(token)`.
4. **Peticiones autenticadas**: Se usa `authFetch()` en lugar de `fetch()` directamente. `authFetch.js` mantiene una variable interna `tokenActual` y la envía como `Authorization: Bearer <token>`.
5. **Refresh automático**: Si el backend responde 401 y `tokenActual` existe, `authFetch()` intenta renovar el token mediante `refreshYReintentar()` que hace `POST /app/bibilo/refresh` con las cookies incluidas. Si el refresh falla, `actualizarToken(null)` limpia el token y propaga el error.
6. **Manejo de errores 401**: `fetch_libros.js` y `fetch_favoritos.js` capturan específicamente status 401 y devuelven `[]` en vez de lanzar errores no manejados, evitando crashes en los componentes.
7. **Logout**: `AuthContext.logout()` limpia token y usuario del estado y localStorage, y también llama a `actualizarToken(null)` para limpiar el token en `authFetch.js`.
8. **Middleware de autenticación** (`autenticacion.js`): Extrae el Bearer token, verifica con `jwt.verify()` usando `JWT_SECRET`, establece `request.usuarioId = decoded.id`.

### 2.3 Flujo de envío de correos

Usa **Resend** como proveedor de correos. Configuración en `config/email_config.js`.

**Confirmación de cuenta** (`email_confirmacion.js`):
- Se llama desde `nuevo_usuario.js` tras crear el usuario.
- Genera JWT con `{ email }` (expira en 1h).
- Construye URL: `{URL_FRONTEND}/confirmar-cuenta?token={token}`.
- Envía desde `onboarding@resend.dev`.

**Cambio de contraseña** (`email_cambio_contraseña.js`):
- Se llama desde `cambiar_contraseña.js` → `POST /solicitar`.
- Genera JWT con `{ email }` (expira en 1h).
- Construye URL: `{baseUrl}/cambiar-contrasena?token={token}`.
  - `baseUrl` se obtiene de `ENVIRONMENT.URL_FRONTEND` o por defecto `http://localhost:5173`.
  - Usa `new URL(ENVIRONMENT.URL_FRONTEND).origin` para normalizar la URL.

**Limitación de Resend**: La cuenta gratuita solo envía emails al correo con el que te registraste en Resend. Para enviar a destinatarios reales hay que verificar un dominio propio.

### 2.4 Flujo de cambio de contraseña

```
Usuario hace clic en "Cambiar contraseña" (Pantalla_principal.jsx)
  → solicitarCambioContraseña(email)
    → POST /app/bibilo/cambiar-contrasena/solicitar { email }
      → Middleware verificarUsuario busca email en DB
        → enviarEmailCambioContraseña(nombre, email)
          → Genera JWT con el email (1h exp)
          → Construye enlace: {baseUrl}/cambiar-contrasena?token={token}
          → Envía correo con Resend
          
Usuario recibe el email, hace clic en el enlace
  → Abre http://localhost:5173/cambiar-contrasena?token=...
    → Ruta en App.tsx renderiza Cambiar_contraseña.jsx
      → Lee token de query params con useSearchParams()
      
Usuario ingresa nueva contraseña y confirma
  → restablecerContraseña(token, nuevaContraseña)
    → POST /app/bibilo/cambiar-contrasena/restablecer { token, nuevaContraseña }
      → Verifica JWT, extrae email
      → Busca usuario por email
      → Hashea nueva contraseña con bcrypt
      → Guarda en DB
```

### 2.5 Conexión a la base de datos

En `src/db/connect.js`:
1. Intenta conectar a MongoDB usando `MONGODB_URl` del `.env`.
2. Si falla y la URI contiene `localhost` o `127.0.0.1`, usa `mongodb-memory-server` como fallback (base de datos en memoria).
3. Si se define `USE_MEMORY_DB=true`, fuerza el uso de la base en memoria.

**Problema**: El `.env` tiene `MONGODB_URl` (con `l` minúscula al final), pero `connect.js` también busca `MONGODB_URI` y `MONGO_DB_CONNECTION_STRING`. Esto puede causar que la conexión caiga al valor hardcodeado por defecto.

### 2.6 Manejo de errores

**Clase `ServerError`** (`helpers/error_class.js`): Extiende `Error` con propiedad `status` (código HTTP).

**Middleware `error_handler.js`**: Captura:
- `ServerError` → devuelve `status` y `message` del error.
- Errores de MongoDB/Mongoose → 503 o 400.
- Errores genéricos → 500.

---

## 3. Frontend

### 3.1 Rutas del frontend

Definidas en `App.tsx` con React Router:

| Ruta | Componente | Descripción |
|---|---|---|
| `/` | `Pantalla_principal` | Página principal (cambia según auth) |
| `/registro` | `nuevo_usuario` | Formulario de registro |
| `/nuevo-usuario` | `nuevo_usuario` | Formulario de registro |
| `/nuevo-libro` | `Nuevo_libro` | Agregar libro |
| `/iniciar-sesion` | `Iniciar_sesion` | Inicio de sesión |
| `/perfil` | `Perfil` | Perfil del usuario |
| `/buscador` | `Buscador` | Buscar libros |
| `/cambiar-contrasena` | `Cambiar_contraseña` | Restablecer contraseña (lee `?token=`) |

**Ruta faltante**: El email de confirmación envía un enlace a `/confirmar-cuenta?token=...` pero no existe una ruta en `App.tsx` para esa URL.

### 3.2 Arquitectura

- **Sin SSR**: Todo el ruteo es del lado del cliente con React Router.
- **Sin librería de estado**: Solo React Context (`AuthContext`) para el estado de autenticación.
- **TypeScript nominal pero código JSX**: El proyecto usa TypeScript (`tsconfig.json`, extensiones `.tsx`) pero todos los componentes están escritos como `.jsx` sin tipos. El `tsconfig` tiene `allowJs: true`.
- **CSS en un solo archivo**: Todo el estilo está en `index.css` con un sistema de diseño consistente (variables CSS para tema de "biblioteca clásica" con colores pergamino, cuero y dorado).
- **Fetch helpers**: Cada grupo de llamadas API está en un archivo separado dentro de `fetch/`.

### 3.3 Componentes (pantallas)

| Componente | Funcionalidad |
|---|---|
| `Pantalla_principal.jsx` | Home. Si autenticado: saludo, links a perfil/buscador/libros, botón "Cambiar contraseña". Si no: links a login/registro. |
| `Iniciar_sesion.jsx` | Formulario email+contraseña. Llama a `/login` directamente con `fetch`. Usa `AuthContext.login()` y redirige a `/perfil`. |
| `nuevo_usuario.jsx` | Formulario de registro. Llama a `fetch_nuevo_usuario()`. Muestra tabla de usuarios creados. |
| `Nuevo_libro.jsx` | Formulario nombre+descripción. Llama a `crearLibro()`. Muestra tabla de libros enviados. |
| `Perfil.jsx` | Datos del usuario, tabla "Mis Libros", tabla "Favoritos". Botón de cerrar sesión. |
| `Buscador.jsx` | Búsqueda local (client-side) sobre los libros del usuario autenticado. |
| `MisLibros.jsx` | Lista de libros con botón para marcar como favorito. |
| `Favoritos.jsx` | Lista de favoritos con botón para quitar. |
| `Cambiar_contraseña.jsx` | Lee `?token=` de la URL. Formulario de nueva contraseña + confirmación. Maneja errores y éxito. |

---

## 4. Problemas conocidos

1. **Ruta de confirmación faltante**: El email de verificación envía a `/confirmar-cuenta?token=...` pero no hay `<Route>` en `App.tsx` para esa ruta.

2. **URL incorrecta en fetch de confirmación**: `fetche_confirmacion_mail.js` envía a `/app/usuarios/confirmar` en vez de `/app/bibilo/verificacion`. Se considera un archivo legacy/roto.

3. **Sin ruta para el link de confirmación**: El componente `Cambiar_contraseña.jsx` existe y funciona, pero el flujo completo solo es testeable si el backend puede enviar el correo o si se usa el email registrado en Resend.

---

## 5. Cambios recientes

### 5.1 Reestructuración de carpetas
- Se aplanó la estructura del frontend: `frontend_bbibloteca/frontend/` → `frontend/`
- Se eliminó el directorio redundante `frontend_bbibloteca/`
- Se actualizó `vercel.json` con las nuevas rutas

### 5.2 Fix de autenticación (authFlow)
- **Problema**: `login()` seteaba el token en React state (`setToken`) pero **no** en `authFetch.js`, por lo que `tokenActual` seguía en `null`. Las requests se enviaban sin `Authorization: Bearer <token>` → backend respondía 401.
- **Solución**:
  - `actualizarToken` se exportó como `export function` para ser importable desde `AuthContext`
  - `login()` ahora llama `actualizarToken(resultado.token)` además de `setToken(resultado.token)`
  - Se agregó `useEffect` en `AuthContext` que sincroniza `actualizarToken(token)` al cambiar usuario/token
  - `logout()` llama `actualizarToken(null)` para limpiar el token también en authFetch
  - `refreshYReintentar()` limpia el token con `actualizarToken(null)` cuando el refresh falla
  - `obtenerMisLibros()` y `obtenerFavoritos()` capturan status 401 y devuelven `[]` en vez de lanzar errores no manejados
