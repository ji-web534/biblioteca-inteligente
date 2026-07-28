# DocumentaciÃ³n â€” Biblioteca Inteligente

 ## Ãndice

1. [Estructura del proyecto](#1-estructura-del-proyecto)
2. [Backend](#2-backend)
   - [Rutas de la API](#21-rutas-de-la-api)
   - [Flujo de autenticaciÃ³n](#22-flujo-de-autenticaciÃ³n)
   - [Flujo de envÃ­o de correos](#23-flujo-de-envÃ­o-de-correos)
   - [Flujo de cambio de contraseÃ±a](#24-flujo-de-cambio-de-contraseÃ±a)
   - [ConexiÃ³n a la base de datos](#25-conexiÃ³n-a-la-base-de-datos)
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
â”œâ”€â”€ .git/
â”œâ”€â”€ postman/                          â†’ Colecciones de Postman para pruebas
â”œâ”€â”€ DOCUMENTACION.md                  â† Este archivo
â”‚
â”œâ”€â”€ backend_bibloteca/                â†’ Servidor Express
â”‚   â”œâ”€â”€ .env                          â†’ Variables de entorno
â”‚   â”œâ”€â”€ package.json
â”‚   â”œâ”€â”€ config/
â”‚   â”‚   â”œâ”€â”€ environment.js            â†’ Lee .env y exporta objeto ENVIRONMENT
â”‚   â”‚   â””â”€â”€ email_config.js           â†’ Inicializa cliente Resend
â”‚   â”œâ”€â”€ postman/
â”‚   â”‚   â””â”€â”€ nuevo_libro.postman_collection.json
â”‚   â””â”€â”€ src/
â”‚       â”œâ”€â”€ main.js                   â†’ Punto de entrada: Express, CORS, rutas, DB, listen
â”‚       â”œâ”€â”€ db/
â”‚       â”‚   â””â”€â”€ connect.js            â†’ ConexiÃ³n Mongoose con fallback a MongoDB en memoria
â”‚       â”œâ”€â”€ end_point/                â†’ Routers de Express (uno por recurso)
â”‚       â”‚   â”œâ”€â”€ Autor.js              â†’ GET /:autor
â”‚       â”‚   â”œâ”€â”€ cambiar_contraseÃ±a.js â†’ POST /solicitar, POST /, POST /restablecer
â”‚       â”‚   â”œâ”€â”€ confir_email.js       â†’ POST /
â”‚       â”‚   â”œâ”€â”€ favoritos.js          â†’ GET /, POST /:libroId, DELETE /:libroId
â”‚       â”‚   â”œâ”€â”€ id.js                 â†’ GET /:id
â”‚       â”‚   â”œâ”€â”€ login.js              â†’ POST /
â”‚       â”‚   â”œâ”€â”€ mis_libros.js         â†’ GET /
â”‚       â”‚   â”œâ”€â”€ nuevo_libros.js       â†’ POST /
â”‚       â”‚   â”œâ”€â”€ editar_libro.js       â†’ PUT /:id
â”‚       â”‚   â”œâ”€â”€ eliminar_libro.js     â†’ DELETE /:id  â† soft delete (activo: false)
â”‚       â”‚   â””â”€â”€ nuevo_usuario.js      â†’ POST /
â”‚       â”œâ”€â”€ esquemas/                 â†’ Modelos de Mongoose
â”‚       â”‚   â”œâ”€â”€ esquema_libro.js
â”‚       â”‚   â””â”€â”€ esquema_usuario.js
â”‚       â”œâ”€â”€ helpers/
â”‚       â”‚   â”œâ”€â”€ email_cambio_contraseÃ±a.js  â†’ EnvÃ­a email de restablecimiento
â”‚       â”‚   â”œâ”€â”€ email_confirmacion.js       â†’ EnvÃ­a email de confirmaciÃ³n de cuenta
â”‚       â”‚   â””â”€â”€ error_class.js              â†’ Clase ServerError
â”‚       â”œâ”€â”€ midleware/                â†’ Middlewares de Express
â”‚       â”‚   â”œâ”€â”€ autenticacion.js      â†’ Verifica JWT Bearer token
â”‚       â”‚   â”œâ”€â”€ error_handler.js      â†’ Manejador global de errores
â”‚       â”‚   â”œâ”€â”€ libros_autenticador.jsâ†’ Busca libro por nombre desde el body
â”‚       â”‚   â””â”€â”€ verificar_usuario.js  â†’ Busca usuario por email desde el body
â”‚       â””â”€â”€ servicios/
â”‚           â””â”€â”€ buscador_libros.js    â†’ POST / - busca libro por nombre
â”‚
â””â”€â”€ frontend/                         â†’ AplicaciÃ³n React + Vite
    â”œâ”€â”€ package.json
    â”œâ”€â”€ vite.config.ts
    â”œâ”€â”€ tsconfig.json / tsconfig.app.json / tsconfig.node.json
    â””â”€â”€ src/
        â”œâ”€â”€ main.tsx                  â†’ Renderiza <App> dentro de <BrowserRouter>
        â”œâ”€â”€ App.tsx                   â†’ AuthProvider + definiciÃ³n de rutas
        â”œâ”€â”€ index.css                 â†’ Estilos globales (tema "biblioteca clÃ¡sica")
        â”œâ”€â”€ assets/                   â†’ hero.png, react.svg, vite.svg
        â”œâ”€â”€ context/
        â”‚   â””â”€â”€ AuthContext.jsx       â†’ Contexto de autenticaciÃ³n (token, usuario, login, logout)
        â”œâ”€â”€ fetch/                    â†’ Llamadas a la API
        â”‚   â”œâ”€â”€ authFetch.js          â†’ MÃ³dulo central de fetch con JWT y refresh automÃ¡tico
        â”‚   â”œâ”€â”€ fetch_nuevo_usuario.js
        â”‚   â”œâ”€â”€ fetch_nuevo_libro.js
        â”‚   â”œâ”€â”€ fetch_libros.js
        â”‚   â”œâ”€â”€ fetch_favoritos.js
        â”‚   â”œâ”€â”€ fetch_cambio_contraseÃ±a.js
        â”‚   â””â”€â”€ fetche_confirmacion_mail.js
        â”œâ”€â”€ helpers/
        â”‚   â””â”€â”€ error_class.js        â†’ Clase backendError
        â””â”€â”€ pantallas/                â†’ Componentes de pÃ¡gina
            â”œâ”€â”€ Pantalla_principal.jsx
            â”œâ”€â”€ Iniciar_sesion.jsx
            â”œâ”€â”€ nuevo_usuario.jsx
            â”œâ”€â”€ Nuevo_libro.jsx
            â”œâ”€â”€ Perfil.jsx
            â”œâ”€â”€ Buscador.jsx
            â”œâ”€â”€ MisLibros.jsx
            â”œâ”€â”€ Favoritos.jsx
            â””â”€â”€ Cambiar_contraseÃ±a.jsx
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
| `/app/bibilo/libro` | `editar_libro.js` | `PUT /:id` | JWT |
| `/app/bibilo/libro` | `eliminar_libro.js` | `DELETE /:id` (soft) | JWT + `can_delete_books` |
| `/app/bibilo/libro` | `hard_delete_libro.js` | `DELETE /:id/hard` (permanent) | JWT + `can_delete_books` |
| `/app/bibilo/mis-libros` | `mis_libros.js` | `GET /` | JWT |
| `/app/bibilo/favoritos` | `favoritos.js` | `GET /`, `POST /:libroId`, `DELETE /:libroId` | JWT |
| `/app/bibilo/buscador` | `buscador_libros.js` | `POST /` | No |
| `/app/bibilo/cambiar-contrasena` | `cambiar_contraseña.js` | `POST /solicitar`, `POST /`, `POST /restablecer` | Variable |
| `/app/bibilo/autor/` | `Autor.js` | `GET /:autor` | No |
| `/app/bibilo/` | `id.js` | `GET /:id` | No |
| `/app/bibilo/admin/usuarios` | `admin_usuarios.js` | `GET /`, `PUT /:id/role`, `PUT /:id/permisos` | JWT + admin |

**Detalle de endpoints de `cambiar-contrasena`:**
- `POST /solicitar` â€” Requiere `{ email }`. Middleware `verificarUsuario` busca el email en DB. EnvÃ­a correo con link de restablecimiento.
- `POST /` â€” Requiere `{ contraseÃ±aActual, nuevaContraseÃ±a }`. Usuario autenticado. Cambia la contraseÃ±a con la actual como verificaciÃ³n.
- `POST /restablecer` â€” Requiere `{ token, nuevaContraseÃ±a }`. Verifica el JWT, busca al usuario por email, actualiza la contraseÃ±a.

### 2.2 Flujo de autenticaciÃ³n

1. **Registro**: Formulario en `nuevo_usuario.jsx` â†’ `POST /app/bibilo/nuevo_usuario` â†’ backend hashea contraseÃ±a con bcrypt, guarda en MongoDB, envÃ­a correo de confirmaciÃ³n.
2. **Login**: Formulario en `Iniciar_sesion.jsx` â†’ `POST /app/bibilo/login` â†’ backend verifica email+contraseÃ±a con bcrypt, devuelve JWT (payload: `{ id, email, nombre, role }`, expira en 15 min) + refreshToken (7d). Frontend llama a `AuthContext.login()` que ejecuta `setToken(resultado.token)` y `actualizarToken(resultado.token)` para sincronizar con `authFetch.js`.
3. **SesiÃ³n**: `AuthContext` hidrata estado desde localStorage al montar. `estaAutenticado` deriva de `!!token`. El token se sincroniza automÃ¡ticamente con `authFetch.js` mediante un `useEffect` que llama a `actualizarToken(token)`.
4. **Peticiones autenticadas**: Se usa `authFetch()` en lugar de `fetch()` directamente. `authFetch.js` mantiene una variable interna `tokenActual` y la envÃ­a como `Authorization: Bearer <token>`.
5. **Refresh automÃ¡tico**: Si el backend responde 401 y `tokenActual` existe, `authFetch()` intenta renovar el token mediante `refreshYReintentar()` que hace `POST /app/bibilo/refresh` con las cookies incluidas. Si el refresh falla, `actualizarToken(null)` limpia el token y propaga el error.
6. **Manejo de errores 401**: `fetch_libros.js` y `fetch_favoritos.js` capturan especÃ­ficamente status 401 y devuelven `[]` en vez de lanzar errores no manejados, evitando crashes en los componentes.
7. **Logout**: `AuthContext.logout()` limpia token y usuario del estado y localStorage, y tambiÃ©n llama a `actualizarToken(null)` para limpiar el token en `authFetch.js`.
8. **Middleware de autenticaciÃ³n** (`autenticacion.js`): Extrae el Bearer token, verifica con `jwt.verify()` usando `JWT_SECRET`, establece `request.usuarioId = decoded.id`.

### 2.3 Flujo de envÃ­o de correos

Usa **Resend** como proveedor de correos. ConfiguraciÃ³n en `config/email_config.js`.

**ConfirmaciÃ³n de cuenta** (`email_confirmacion.js`):
- Se llama desde `nuevo_usuario.js` tras crear el usuario.
- Genera JWT con `{ email }` (expira en 1h).
- Construye URL: `{URL_FRONTEND}/confirmar-cuenta?token={token}`.
- EnvÃ­a desde `onboarding@resend.dev`.

**Cambio de contraseÃ±a** (`email_cambio_contraseÃ±a.js`):
- Se llama desde `cambiar_contraseÃ±a.js` â†’ `POST /solicitar`.
- Genera JWT con `{ email }` (expira en 1h).
- Construye URL: `{baseUrl}/cambiar-contrasena?token={token}`.
  - `baseUrl` se obtiene de `ENVIRONMENT.URL_FRONTEND` o por defecto `http://localhost:5173`.
  - Usa `new URL(ENVIRONMENT.URL_FRONTEND).origin` para normalizar la URL.

**LimitaciÃ³n de Resend**: La cuenta gratuita solo envÃ­a emails al correo con el que te registraste en Resend. Para enviar a destinatarios reales hay que verificar un dominio propio.

### 2.4 Flujo de cambio de contraseÃ±a

```
Usuario hace clic en "Cambiar contraseÃ±a" (Pantalla_principal.jsx)
  â†’ solicitarCambioContraseÃ±a(email)
    â†’ POST /app/bibilo/cambiar-contrasena/solicitar { email }
      â†’ Middleware verificarUsuario busca email en DB
        â†’ enviarEmailCambioContraseÃ±a(nombre, email)
          â†’ Genera JWT con el email (1h exp)
          â†’ Construye enlace: {baseUrl}/cambiar-contrasena?token={token}
          â†’ EnvÃ­a correo con Resend
          
Usuario recibe el email, hace clic en el enlace
  â†’ Abre http://localhost:5173/cambiar-contrasena?token=...
    â†’ Ruta en App.tsx renderiza Cambiar_contraseÃ±a.jsx
      â†’ Lee token de query params con useSearchParams()
      
Usuario ingresa nueva contraseÃ±a y confirma
  â†’ restablecerContraseÃ±a(token, nuevaContraseÃ±a)
    â†’ POST /app/bibilo/cambiar-contrasena/restablecer { token, nuevaContraseÃ±a }
      â†’ Verifica JWT, extrae email
      â†’ Busca usuario por email
      â†’ Hashea nueva contraseÃ±a con bcrypt
      â†’ Guarda en DB
```

### 2.5 ConexiÃ³n a la base de datos

En `src/db/connect.js`:
1. Intenta conectar a MongoDB usando `MONGODB_URl` del `.env`.
2. Si falla y la URI contiene `localhost` o `127.0.0.1`, usa `mongodb-memory-server` como fallback (base de datos en memoria).
3. Si se define `USE_MEMORY_DB=true`, fuerza el uso de la base en memoria.

El `.env` usa `MONGODB_URI` correctamente. Si no se define la variable, `connect.js` construye la URI desde `MONGO_DB_CONNECTION_STRING` y `MONGO_DB_NAME` con sus valores por defecto.

### 2.6 Manejo de errores

**Clase `ServerError`** (`helpers/error_class.js`): Extiende `Error` con propiedad `status` (cÃ³digo HTTP).

**Middleware `error_handler.js`**: Captura:
- `ServerError` â†’ devuelve `status` y `message` del error.
- Errores de MongoDB/Mongoose â†’ 503 o 400.
- Errores genÃ©ricos â†’ 500.

---

## 3. Frontend

### 3.1 Rutas del frontend

Definidas en `App.tsx` con React Router:

| Ruta | Componente | DescripciÃ³n |
|---|---|---|
| `/` | `Pantalla_principal` | PÃ¡gina principal (cambia segÃºn auth) |
| `/registro` | `nuevo_usuario` | Formulario de registro |
| `/nuevo-usuario` | `nuevo_usuario` | Formulario de registro |
| `/nuevo-libro` | `Nuevo_libro` | Agregar libro |
| `/iniciar-sesion` | `Iniciar_sesion` | Inicio de sesiÃ³n |
| `/perfil` | `Perfil` | Perfil del usuario |
| `/buscador` | `Buscador` | Buscar libros |
| `/cambiar-contrasena` | `Cambiar_contraseÃ±a` | Restablecer contraseÃ±a (lee `?token=`) |

**Ruta faltante**: El email de confirmaciÃ³n envÃ­a un enlace a `/confirmar-cuenta?token=...` pero no existe una ruta en `App.tsx` para esa URL.

### 3.2 Arquitectura

- **Sin SSR**: Todo el ruteo es del lado del cliente con React Router.
- **Sin librerÃ­a de estado**: Solo React Context (`AuthContext`) para el estado de autenticaciÃ³n.
- **TypeScript nominal pero cÃ³digo JSX**: El proyecto usa TypeScript (`tsconfig.json`, extensiones `.tsx`) pero todos los componentes estÃ¡n escritos como `.jsx` sin tipos. El `tsconfig` tiene `allowJs: true`.
- **CSS en un solo archivo**: Todo el estilo estÃ¡ en `index.css` con un sistema de diseÃ±o consistente (variables CSS para tema de "biblioteca clÃ¡sica" con colores pergamino, cuero y dorado).
- **Fetch helpers**: Cada grupo de llamadas API estÃ¡ en un archivo separado dentro de `fetch/`.

### 3.3 Componentes (pantallas)

| Componente | Funcionalidad |
|---|---|
| `Pantalla_principal.jsx` | Home. Si autenticado: saludo, links a perfil/buscador/libros, botÃ³n "Cambiar contraseÃ±a". Si no: links a login/registro. |
| `Iniciar_sesion.jsx` | Formulario email+contraseÃ±a. Llama a `/login` directamente con `fetch`. Usa `AuthContext.login()` y redirige a `/perfil`. |
| `nuevo_usuario.jsx` | Formulario de registro. Llama a `fetch_nuevo_usuario()`. Muestra tabla de usuarios creados. |
| `Nuevo_libro.jsx` | Formulario nombre+descripciÃ³n. Llama a `crearLibro()`. Muestra tabla de libros enviados. |
| `Perfil.jsx` | Datos del usuario, tabla "Mis Libros", tabla "Favoritos". BotÃ³n de cerrar sesiÃ³n. |
| `Buscador.jsx` | BÃºsqueda local (client-side) sobre los libros del usuario autenticado. |
| `MisLibros.jsx` | Lista de libros con botÃ³n para marcar como favorito. |
| `Favoritos.jsx` | Lista de favoritos con botÃ³n para quitar. |
| `Cambiar_contraseÃ±a.jsx` | Lee `?token=` de la URL. Formulario de nueva contraseÃ±a + confirmaciÃ³n. Maneja errores y Ã©xito. |

---

## 4. Problemas conocidos

1. **Ruta de confirmaciÃ³n faltante**: El email de verificaciÃ³n envÃ­a a `/confirmar-cuenta?token=...` pero no hay `<Route>` en `App.tsx` para esa ruta.

2. **URL incorrecta en fetch de confirmaciÃ³n**: `fetche_confirmacion_mail.js` envÃ­a a `/app/usuarios/confirmar` en vez de `/app/bibilo/verificacion`. Se considera un archivo legacy/roto.

3. **Sin ruta para el link de confirmaciÃ³n**: El componente `Cambiar_contraseÃ±a.jsx` existe y funciona, pero el flujo completo solo es testeable si el backend puede enviar el correo o si se usa el email registrado en Resend.

---

## 5. Cambios recientes

### 5.1 ReestructuraciÃ³n de carpetas
- Se aplanÃ³ la estructura del frontend: `frontend_bbibloteca/frontend/` â†’ `frontend/`
- Se eliminÃ³ el directorio redundante `frontend_bbibloteca/`
- Se actualizÃ³ `vercel.json` con las nuevas rutas

### 5.2 Arquitectura de autenticaciÃ³n (JWT + Refresh Token)

**Modelo de seguridad implementado:**

| Token | Almacenamiento | DuraciÃ³n | PropÃ³sito |
|---|---|---|---|
| Access Token (JWT) | Memoria del frontend (React state + variable authFetch) | 15 min | Autorizar cada peticiÃ³n HTTP |
| Refresh Token | Cookie HttpOnly (JS no puede leerla) | 7 dÃ­as | Renovar el Access Token silenciosamente |

**Flujo completo:**

```
Login (email+contraseÃ±a)
  â†’ Backend crea Access Token (15 min) + Refresh Token (7 dÃ­as)
  â†’ Access Token â†’ response.body.token (memoria frontend)
  â†’ Refresh Token â†’ cookie HttpOnly (inaccesible para JS)
  â†’ Frontend guarda token en React state + authFetch.tokenActual

PeticiÃ³n a /mis-libros
  â†’ authFetch() envÃ­a Authorization: Bearer <token>

Access Token expira (15 min)
  â†’ Backend responde 401
  â†’ authFetch.refreshYReintentar() hace POST /refresh
    â†’ Cookie HttpOnly se envÃ­a automÃ¡ticamente (credentials: 'include')
    â†’ Backend verifica, rota tokens, devuelve nuevo Access Token
  â†’ Reintenta la peticiÃ³n original con el nuevo token

Logout
  â†’ POST /logout con Bearer token
  â†’ Backend revoca Refresh Token en la colecciÃ³n â†’ cookie eliminada
  â†’ Frontend limpia token de estado y authFetch
```

### 5.3 Refresh Token Rotation (RTR) + DetecciÃ³n de reutilizaciÃ³n

**Nuevo modelo `esquema_refresh_token.js`:**
```javascript
{
  token: String,        // JWT del refresh token
  usuarioId: ObjectId,  // Referencia al usuario
  familia: String,      // Grupo familiar de tokens (misma sesiÃ³n)
  status: String,       // "active" | "used" | "revoked"
  createdAt: Date       // Auto-expira a los 30 dÃ­as
}
```

**RotaciÃ³n (RTR):** Cada vez que se usa un Refresh Token para renovar:
1. El token actual se marca como `"used"`
2. Se crea un nuevo token `"active"` con la misma `familia`
3. El viejo token ya no sirve aunque un atacante lo intercepte

**DetecciÃ³n de reutilizaciÃ³n (alerta de intrusiÃ³n):**
Si el servidor recibe un token con status `"used"` (alguien intentÃ³ reutilizar una llave vieja):
1. Asume que hubo una brecha de seguridad
2. Revoca TODOS los tokens de esa familia
3. Responde `401 "SesiÃ³n comprometida. Todos los dispositivos fueron desconectados."`
4. El usuario debe volver a iniciar sesiÃ³n

**RevocaciÃ³n activa (logout):**
- `logout.js` marca el Refresh Token como `"revoked"`
- La cookie se elimina con `clearCookie()`
- Cualquier intento de refresco con un token `"revoked"` â†’ 401

### 5.4 Backend â€” payload completo en el middleware

`autenticacion.js` ahora adjunta al request:
- `request.usuarioId` â†’ ID del usuario
- `request.usuarioRole` â†’ role (user / moderator / admin)
- `request.usuarioPermisos` â†’ objeto de permisos granular

Esto permite que los middlewares de autorizaciÃ³n (`autorizacion.js`) y las rutas validen permisos sin consultar la base de datos nuevamente (validaciÃ³n criptogrÃ¡fica local, ultra rÃ¡pida).

### 5.5 Frontend â€” simplificaciÃ³n de authFetch

- Se eliminÃ³ `setTokenRefresher` y el callback `onTokenChange`
- `authFetch.js` ahora es solo un mÃ³dulo de utilidad que lee `tokenActual`
- `AuthContext.jsx` es la **Ãºnica fuente de verdad** del token
- Login/logout/refresh llaman directamente a `actualizarToken()` para sincronizar

### 5.6 Seguridad â€” ReDoS y NoSQL injection

**Problemas detectados:**
- `Autor.js` y `buscar_libros.js` usaban `new RegExp(input, "i")` con input de URL sin sanitizar â†’ **ReDoS**
- `id.js` usaba `findById(id)` sin validar que `id` fuera un ObjectId vÃ¡lido â†’ **NoSQL injection**

**SoluciÃ³n:**
- Se creÃ³ `helpers/regex_utils.js` con funciÃ³n `escaparRegex()`
- `Autor.js`: input sanitizado, validaciÃ³n de longitud mÃ¡xima 100
- `buscar_libros.js`: input sanitizado, validaciÃ³n de longitud mÃ¡xima 100
- `id.js`: validaciÃ³n con `mongoose.Types.ObjectId.isValid()`

### 5.7 Regla de seguridad general

> **El Frontend decide quÃ© mostrar (experiencia de usuario), pero el Backend decide quÃ© permitir (seguridad).**

- **Frontend (UI)**: Lee el rol/permisos del usuario en memoria para ocultar/mostrar botones y vistas
- **Backend (API)**: El middleware `autenticacion.js` verifica el JWT y los permisos en cada peticiÃ³n

---

## Pendientes Frontend

- [ ] Página de administración de usuarios (`/admin/usuarios`) para listar, cambiar roles y permisos.
- [ ] Botones de acción (remover/eliminar libro) en `MisLibros.jsx` y `Buscador.jsx`.
- [ ] Ruta `/admin` protegida con `autorizacion("admin")` en el frontend.
