# Documentacion - Biblioteca Inteligente

## Indice

1. [Estructura del proyecto](#1-estructura-del-proyecto)
2. [Backend](#2-backend)
   - [Rutas de la API](#21-rutas-de-la-api)
   - [Flujo de autenticacion](#22-flujo-de-autenticacion)
   - [Flujo de envio de correos](#23-flujo-de-envio-de-correos)
   - [Flujo de cambio de contraseÃ±a](#24-flujo-de-cambio-de-contraseÃ±a)
   - [ConexiÃ³n a la base de datos](#25-conexiÃ³n-a-la-base-de-datos)
   - [Manejo de errores](#26-manejo-de-errores)
   - [Middleware de validacion generica](#27-middleware-de-validacion-generica)
   - [Eliminacion de libros (soft/hard delete)](#28-eliminacion-de-libros)
   - [Endpoints de administracion](#29-endpoints-de-administracion)
3. [Frontend](#3-frontend)
   - [Rutas del frontend](#31-rutas-del-frontend)
   - [Arquitectura](#32-arquitectura)
   - [Componentes (pantallas)](#33-componentes-pantallas)
4. [Problemas conocidos](#4-problemas-conocidos)
5. [Cambios recientes](#5-cambios-recientes)
6. [Pendientes](#6-pendientes)

---

## 1. Estructura del proyecto

```
biblo/
â”œâ”€â”€ .git/
â”œâ”€â”€ postman/                          -> Colecciones de Postman para pruebas
â”œâ”€â”€ DOCUMENTACION.md                  <- Este archivo
â”‚
â”œâ”€â”€ backend_bibloteca/                -> Servidor Express
â”‚   â”œâ”€â”€ .env                          -> Variables de entorno
â”‚   â”œâ”€â”€ package.json
â”‚   â”œâ”€â”€ config/
â”‚   â”‚   â”œâ”€â”€ environment.js            -> Lee .env y exporta objeto ENVIRONMENT
â”‚   â”‚   â””â”€â”€ email_config.js           -> Inicializa cliente Resend
â”‚   â”œâ”€â”€ postman/
â”‚   â”‚   â””â”€â”€ nuevo_libro.postman_collection.json
â”‚   â””â”€â”€ src/
â”‚       â”œâ”€â”€ main.js                   -> Punto de entrada: Express, CORS, rutas, DB, listen
â”‚       â”œâ”€â”€ db/
â”‚       â”‚   â””â”€â”€ connect.js            -> ConexiÃ³n Mongoose con fallback a MongoDB en memoria
â”‚       â”œâ”€â”€ end_point/                -> Routers de Express (uno por recurso)
â”‚       â”‚   â”œâ”€â”€ Autor.js              -> GET /:autor
â”‚       â”‚   â”œâ”€â”€ cambiar_contraseÃ±a.js -> POST /solicitar, POST /, POST /restablecer
â”‚       â”‚   â”œâ”€â”€ confir_email.js       -> POST /
â”‚       â”‚   â”œâ”€â”€ editar_libro.js       -> PUT /:id
â”‚       â”‚   â”œâ”€â”€ eliminar_libro.js     -> DELETE /:id (soft delete, activo: false)
â”‚       â”‚   â”œâ”€â”€ hard_delete_libro.js  -> DELETE /:id/hard (eliminacion permanente)
â”‚       â”‚   â”œâ”€â”€ favoritos.js          -> GET /, POST /:libroId, DELETE /:libroId
â”‚       â”‚   â”œâ”€â”€ id.js                 -> GET /:id
â”‚       â”‚   â”œâ”€â”€ login.js              -> POST /
â”‚       â”‚   â”œâ”€â”€ mis_libros.js         -> GET /
â”‚       â”‚   â”œâ”€â”€ nuevo_libros.js       -> POST /
â”‚       â”‚   â”œâ”€â”€ nuevo_usuario.js      -> POST /
â”‚       â”‚   â””â”€â”€ admin_usuarios.js     -> GET /, PUT /:id/role, PUT /:id/permisos
â”‚       â”œâ”€â”€ esquemas/                 -> Modelos de Mongoose
â”‚       â”‚   â”œâ”€â”€ esquema_libro.js
â”‚       â”‚   â”œâ”€â”€ esquema_usuario.js
â”‚       â”‚   â”œâ”€â”€ esquema_refresh_token.js
â”‚       â”‚   â””â”€â”€ esquema_moderacion.js
â”‚       â”œâ”€â”€ helpers/
â”‚       â”‚   â”œâ”€â”€ email_cambio_contraseÃ±a.js  -> Envia email de restablecimiento
â”‚       â”‚   â”œâ”€â”€ email_confirmacion.js       -> Envia email de confirmacion de cuenta
â”‚       â”‚   â”œâ”€â”€ error_class.js              -> Clase ServerError
â”‚       â”‚   â””â”€â”€ regex_utils.js              -> Funcion escaparRegex
â”‚       â”œâ”€â”€ midleware/                -> Middlewares de Express
â”‚       â”‚   â”œâ”€â”€ autenticacion.js      -> Verifica JWT Bearer token
â”‚       â”‚   â”œâ”€â”€ autorizacion.js       -> Middleware de roles y permisos
â”‚       â”‚   â”œâ”€â”€ check_passwords.js    -> Script de debug de contraseÃ±as
â”‚       â”‚   â”œâ”€â”€ check_users.js        -> Script de debug de usuarios
â”‚       â”‚   â”œâ”€â”€ error_handler.js      -> Manejador global de errores
â”‚       â”‚   â”œâ”€â”€ libros_autenticador.js-> Busca libro por nombre desde el body
â”‚       â”‚   â”œâ”€â”€ validar_campos.js     -> Middleware de validacion generica por schema
â”‚       â”‚   â””â”€â”€ verificar_usuario.js  -> Busca usuario por email desde el body
â”‚       â””â”€â”€ servicios/
â”‚           â””â”€â”€ buscador_libros.js    -> POST / - busca libro por nombre
â”‚
â””â”€â”€ frontend/                         -> Aplicacion React + Vite
    â”œâ”€â”€ package.json
    â”œâ”€â”€ vite.config.ts
    â”œâ”€â”€ tsconfig.json / tsconfig.app.json / tsconfig.node.json
    â””â”€â”€ src/
        â”œâ”€â”€ main.tsx                  -> Renderiza <App> dentro de <BrowserRouter>
        â”œâ”€â”€ App.tsx                   -> AuthProvider + definicion de rutas
        â”œâ”€â”€ index.css                 -> Estilos globales (tema "biblioteca clasica")
        â”œâ”€â”€ assets/                   -> hero.png, react.svg, vite.svg
        â”œâ”€â”€ context/
        â”‚   â””â”€â”€ AuthContext.jsx       -> Contexto de autenticacion (token, usuario, login, logout)
        â”œâ”€â”€ fetch/                    -> Llamadas a la API agrupadas por dominio
        â”‚   â”œâ”€â”€ authFetch.js          -> Modulo central de fetch con JWT y refresh automatico
        â”‚   â”œâ”€â”€ auth.js               -> iniciarSesion, registrarUsuario, confirmarEmail
        â”‚   â”œâ”€â”€ libros.js             -> crearLibro, buscarLibros, editarLibro, obtenerMisLibros, removerLibro, eliminarLibro
        â”‚   â”œâ”€â”€ cuenta.js             -> solicitarCambioContrasena, restablecerContrasena
        â”‚   â””â”€â”€ fetch_favoritos.js    -> obtenerFavoritos, agregarFavorito, quitarFavorito
        â”œâ”€â”€ helpers/
        â”‚   â””â”€â”€ error_class.js        -> Clase backendError
        â””â”€â”€ pantallas/                -> Componentes de pagina
            â”œâ”€â”€ Pantalla_principal.jsx
            â”œâ”€â”€ Iniciar_sesion.jsx
            â”œâ”€â”€ nuevo_usuario.jsx
            â”œâ”€â”€ Nuevo_libro.jsx
            â”œâ”€â”€ Perfil.jsx
            â”œâ”€â”€ Buscador.jsx
            â”œâ”€â”€ MisLibros.jsx
            â”œâ”€â”€ Favoritos.jsx
            â”œâ”€â”€ ConfirmarCuenta.jsx
            â””â”€â”€ Cambiar_contraseÃ±a.jsx
```

---

## 2. Backend

### 2.1 Rutas de la API

Todas las rutas se montan en `src/main.js` con prefijo base `app.use()`.

| Ruta base | Archivo | Endpoints | Auth |
|---|---|---|---|
| `/app/bibilo/nuevo_usuario` | `nuevo_usuario.js` | `POST /` | No |
| `/app/bibilo/verificaciÃ³n` | `confir_email.js` | `POST /` | No |
| `/app/bibilo/login` | `login.js` | `POST /` | No |
| `/app/bibilo/nuevo_libro` | `nuevo_libros.js` | `POST /` | JWT |
| `/app/bibilo/libro` | `editar_libro.js` | `PUT /:id` | JWT |
| `/app/bibilo/libro` | `eliminar_libro.js` | `DELETE /:id` (soft delete) | JWT + `can_delete_books` |
| `/app/bibilo/libro` | `hard_delete_libro.js` | `DELETE /:id/hard` (permanent) | JWT + `can_delete_books` |
| `/app/bibilo/mis-libros` | `mis_libros.js` | `GET /` | JWT |
| `/app/bibilo/favoritos` | `favoritos.js` | `GET /`, `POST /:libroId`, `DELETE /:libroId` | JWT |
| `/app/bibilo/buscador` | `buscador_libros.js` | `POST /` | No |
| `/app/bibilo/cambiar-contraseña` | `cambiar_contraseÃ±a.js` | `POST /solicitar`, `POST /`, `POST /restablecer` | Variable |
| `/app/bibilo/autor/` | `Autor.js` | `GET /:autor` | No |
| `/app/bibilo/` | `id.js` | `GET /:id` | No |
| `/app/bibilo/admin/usuarios` | `admin_usuarios.js` | `GET /`, `PUT /:id/role`, `PUT /:id/permisos` | JWT + admin |

**Detalle de endpoints de `cambiar-contraseÃ±a`:**
- `POST /solicitar` â€” Requiere `{ email }`. Middleware `verificarUsuario` busca el email en DB. Envia correo con link de restablecimiento.
- `POST /` â€” Requiere `{ nuevaContrasena }`. Usuario autenticado. Cambia la contraseÃ±a sin necesidad de la actual.
- `POST /restablecer` â€” Requiere `{ token, nuevaContrasena }`. Verifica el JWT, busca al usuario por email, actualiza la contraseÃ±a.

**Detalle de endpoints de `admin/usuarios`:**
- `GET /` â€” Lista todos los usuarios (sin contraseÃ±a). Solo admin.
- `PUT /:id/role` â€” Cambia el role de un usuario. Requiere `{ role }`. Solo admin.
- `PUT /:id/permisos` â€” Cambia los permisos granulares de un usuario. Requiere `{ permisos }`. Solo admin.

**Roles disponibles:** `user`, `moderator`, `admin`.

**Permisos granulares:** `can_delete_books`, `can_edit_others_books`, `can_manage_categories`, `can_suspend_users`, `can_manage_users`.

### 2.2 Flujo de autenticacion

1. **Registro**: Formulario en `nuevo_usuario.jsx` -> `POST /app/bibilo/nuevo_usuario` -> backend hashea contraseÃ±a con bcrypt, guarda en MongoDB, envia correo de confirmacion.
2. **Login**: Formulario en `Iniciar_sesion.jsx` -> `POST /app/bibilo/login` -> backend verifica email+contraseÃ±a con bcrypt, devuelve JWT (payload: `{ id, email, nombre, role, permisos }`, expira en 15 min) + refreshToken (7d). Frontend llama a `AuthContext.login()` que ejecuta `setToken(resultado.token)` y `actualizarToken(resultado.token)` para sincronizar con `authFetch.js`.
3. **SesiÃ³n**: `AuthContext` hidrata estado desde localStorage al montar. `estaAutenticado` deriva de `!!token`. El token se sincroniza automaticamente con `authFetch.js` mediante un `useEffect` que llama a `actualizarToken(token)`.
4. **Peticiones autenticadas**: Se usa `authFetch()` en lugar de `fetch()` directamente. `authFetch.js` mantiene una variable interna `tokenActual` y la envia como `Authorization: Bearer <token>`.
5. **Refresh automatico**: Si el backend responde 401 y `tokenActual` existe, `authFetch()` intenta renovar el token mediante `refreshYReintentar()` que hace `POST /app/bibilo/refresh` con las cookies incluidas. Si el refresh falla, `actualizarToken(null)` limpia el token y propaga el error.
6. **Manejo de errores 401**: `fetch/libros.js` y `fetch/fetch_favoritos.js` capturan especificamente status 401 y devuelven `[]` en vez de lanzar errores no manejados, evitando crashes en los componentes.
7. **Logout**: `AuthContext.logout()` limpia token y usuario del estado y localStorage, y tambien llama a `actualizarToken(null)` para limpiar el token en `authFetch.js`.
8. **Middleware de autenticacion** (`autenticacion.js`): Extrae el Bearer token, verifica con `jwt.verify()` usando `JWT_SECRET`, establece `request.usuarioId = decoded.id`.

### 2.3 Flujo de envio de correos

Usa **Resend** como proveedor de correos. Configuracion en `config/email_config.js`.

**Confirmacion de cuenta** (`email_confirmacion.js`):
- Se llama desde `nuevo_usuario.js` tras crear el usuario.
- Genera JWT con `{ email }` (expira en 1h).
- Construye URL: `{URL_FRONTEND}/confirmar-cuenta?token={token}`.
- Envia desde `onboarding@resend.dev`.

**Cambio de contraseÃ±a** (`email_cambio_contraseÃ±a.js`):
- Se llama desde `cambiar_contraseÃ±a.js` -> `POST /solicitar`.
- Genera JWT con `{ email }` (expira en 1h).
- Construye URL: `{baseUrl}/cambiar-contraseÃ±a?token={token}` usando `ENVIRONMENT.URL_FRONTEND`.

### 2.4 Flujo de cambio de contraseÃ±a

```
Usuario hace clic en "Cambiar contraseÃ±a" (Pantalla_principal.jsx)
  -> solicitarCambioContrasena(email)
    -> POST /app/bibilo/cambiar-contraseña/solicitar { email }
      -> Middleware verificarUsuario busca email en DB
        -> enviarEmailCambioContrasena(nombre, email)
          -> Genera JWT con el email (1h exp)
          -> Construye enlace: {baseUrl}/cambiar-contraseÃ±a?token={token}
          -> Envia correo con Resend

Usuario recibe el email, hace clic en el enlace
  -> Abre http://localhost:5173/cambiar-contraseña?token=...
    -> Ruta en App.tsx renderiza Cambiar_contraseÃ±a.jsx
      -> Lee token de query params con useSearchParams()

Usuario ingresa nueva contraseÃ±a y confirma
  -> restablecerContrasena(token, nuevaContrasena)
    -> POST /app/bibilo/cambiar-contraseña/restablecer { token, nuevaContrasena }
      -> Verifica JWT, extrae email
      -> Busca usuario por email
      -> Hashea nueva contraseÃ±a con bcrypt
      -> Guarda en DB
```

### 2.5 ConexiÃ³n a la base de datos

En `src/db/connect.js`:
1. Intenta conectar a MongoDB usando `MONGODB_URI` del `.env`.
2. Si falla y la URI contiene `localhost` o `127.0.0.1`, usa `mongodb-memory-server` como fallback (base de datos en memoria).
3. Si se define `USE_MEMORY_DB=true`, fuerza el uso de la base en memoria.

El `.env` usa `MONGODB_URI` correctamente. Si no se define la variable, `connect.js` construye la URI desde `MONGO_DB_CONNECTION_STRING` y `MONGO_DB_NAME` con sus valores por defecto.

### 2.6 Manejo de errores

**Clase `ServerError`** (`helpers/error_class.js`): Extiende `Error` con propiedad `status` (codigo HTTP).

**Middleware `error_handler.js`**: Captura:
- `ServerError` -> devuelve `status` y `message` del error.
- Errores de MongoDB/Mongoose -> 503 o 400.
- Errores genericos -> 500.

### 2.7 Middleware de validacion generica

**Archivo**: `midleware/validar_campos.js`

Recibe un schema que define las reglas de validacion por campo (`body`, `params`, `query`). Cada campo puede tener:

| Propiedad | Tipo | Descripcion |
|---|---|---|
| `requerido` | `boolean` | El campo debe estar presente y no vacio |
| `tipo` | `string` | Tipo esperado: `"string"`, `"number"`, `"objectId"` |
| `min` | `number` | Longitud minima (string) o valor minimo (number) |
| `max` | `number` | Longitud maxima (string) o valor maximo (number) |
| `coincidir` | `RegExp` | Patrome regex que debe coincidir |
| `sanitizar` | `string \| string[]` | Operaciones: `"trim"`, `"escaparRegex"`, `"lowercase"` |
| `mensaje` | `string` | Mensaje de error personalizado |

Si alguna validacion falla, lanza un `ServerError` con el codigo HTTP correspondiente, que es capturado por el `error_handler` global.

**Ejemplo de uso:**
```js
router.post("/", verificarUsuario, validarCampos({
    body: {
        nombre: { requerido: true, tipo: "string", min: 1, max: 100, sanitizar: "trim" },
        email: { requerido: true, tipo: "string", sanitizar: ["trim", "lowercase"] }
    }
}), handler)
```

### 2.8 Soft delete y hard delete de libros

**Soft delete** (`eliminar_libro.js`):
- `DELETE /app/bibilo/libro/:id`
- Requiere JWT + permiso `can_delete_books`
- Setea `activo: false` en el libro (no se elimina de la base de datos)
- Los demas endpoints (`buscar_libros`, `Autor`, `mis_libros`, `id`) filtran por `activo: true`

**Hard delete** (`hard_delete_libro.js`):
- `DELETE /app/bibilo/libro/:id/hard`
- Requiere JWT + permiso `can_delete_books`
- Elimina permanentemente el documento de la base de datos con `deleteOne()`

**Esquema de libro** (`esquema_libro.js`):
- Campo `activo: { type: Boolean, default: true }` que marca si el libro esta activo o eliminado.

### 2.9 Endpoints de administracion

**Archivo**: `admin_usuarios.js`

- `GET /app/bibilo/admin/usuarios` â€” Lista todos los usuarios sin contraseÃ±a. Requiere role `admin`.
- `PUT /app/bibilo/admin/usuarios/:id/role` â€” Cambia el role de un usuario. Requiere `{ role: "user" | "moderator" | "admin" }`. Requiere role `admin`.
- `PUT /app/bibilo/admin/usuarios/:id/permisos` â€” Cambia los permisos granulares. Requiere `{ permisos: { can_delete_books: bool, ... } }`. Requiere role `admin`.

---

## 3. Frontend

### 3.1 Rutas del frontend

Definidas en `App.tsx` con React Router:

| Ruta | Componente | Descripcion |
|---|---|---|
| `/` | `Pantalla_principal` | Pagina principal (cambia segun auth) |
| `/registro` | `nuevo_usuario` | Formulario de registro |
| `/nuevo-usuario` | `nuevo_usuario` | Formulario de registro |
| `/nuevo-libro` | `Nuevo_libro` | Agregar libro |
| `/iniciar-sesion` | `Iniciar_sesion` | Inicio de sesion |
| `/perfil` | `Perfil` | Perfil del usuario |
| `/buscador` | `Buscador` | Buscar libros |
| `/cambiar-contraseÃ±a` | `Cambiar_contraseÃ±a` | Restablecer contraseÃ±a (lee `?token=`) |

### 3.2 Arquitectura

- **Sin SSR**: Todo el ruteo es del lado del cliente con React Router.
- **Sin librerÃ­a de estado**: Solo React Context (`AuthContext`) para el estado de autenticacion.
- **TypeScript nominal pero codigo JSX**: El proyecto usa TypeScript (`tsconfig.json`, extensiones `.tsx`) pero todos los componentes estan escritos como `.jsx` sin tipos. El `tsconfig` tiene `allowJs: true`.
- **CSS en un solo archivo**: Todo el estilo esta en `index.css` con un sistema de diseno consistente (variables CSS para tema de "biblioteca clasica" con colores pergamino, cuero y dorado).
- **Fetch helpers**: Cada grupo de llamadas API esta en un archivo separado dentro de `fetch/`, agrupados por dominio (`auth.js`, `libros.js`, `cuenta.js`, `fetch_favoritos.js`).

### 3.3 Componentes (pantallas)

| Componente | Funcionalidad |
|---|---|
| `Pantalla_principal.jsx` | Home. Si autenticado: saludo, links a perfil/buscador/libros, boton "Cambiar contraseÃ±a", boton "Cerrar sesiÃ³n". Si no: links a login/registro. |
| `Iniciar_sesion.jsx` | Formulario email+contraseÃ±a. Llama a `/login` directamente con `fetch`. Usa `AuthContext.login()` y redirige a `/perfil`. |
| `nuevo_usuario.jsx` | Formulario de registro. Llama a `registrarUsuario()`. Muestra tabla de usuarios creados. |
| `Nuevo_libro.jsx` | Formulario nombre+descripciÃ³n. Llama a `crearLibro()`. Muestra tabla de libros enviados. |
| `Perfil.jsx` | Datos del usuario, tabla "Mis Libros" (con botones remover/eliminar libro), tabla "Favoritos". Boton de cerrar sesiÃ³n. |
| `Buscador.jsx` | Busqueda local (client-side) sobre los libros del usuario autenticado. Con botones remover/eliminar para cada libro en resultados. |
| `MisLibros.jsx` | Lista de libros del usuario con botones Favorito, Remover libro (soft delete), Eliminar libro (hard delete). |
| `Favoritos.jsx` | Lista de favoritos con boton para quitar. |
| `ConfirmarCuenta.jsx` | Lee `?token=` de la URL. Confirma cuenta llamando al backend. |
| `Cambiar_contraseÃ±a.jsx` | Lee `?token=` de la URL. Formulario de nueva contraseÃ±a + confirmacion. Maneja errores y exito. |

---

## 4. Problemas conocidos

1. **Ruta de confirmacion faltante**: El email de verificaciÃ³n envia a `/confirmar-cuenta?token=...` pero no hay `<Route>` en `App.tsx` para esa ruta.
2. **URL incorrecta en fetch de confirmacion**: `fetche_confirmacion_mail.js` (ya eliminado) enviaba a `/app/usuarios/confirmar` en vez de `/app/bibilo/verificaciÃ³n`. Este archivo ya fue eliminado.
3. **Sin pagina de administracion**: Los endpoints `/admin/usuarios` existen en el backend pero la interfaz frontend para administrar usuarios no existe todavia (pendiente).

---

## 5. Cambios recientes

### 5.1 Reestructuracion de carpetas
- Se aplanÃ³ la estructura del frontend: `frontend_bbibloteca/frontend/` -> `frontend/`
- Se elimino el directorio redundante `frontend_bbibloteca/`
- Se actualizo `vercel.json` con las nuevas rutas

### 5.2 Arquitectura de autenticacion (JWT + Refresh Token)

**Modelo de seguridad implementado:**

| Token | Almacenamiento | Duracion | Proposito |
|---|---|---|---|
| Access Token (JWT) | Memoria del frontend (React state + variable authFetch) | 15 min | Autorizar cada peticion HTTP |
| Refresh Token | Cookie HttpOnly (JS no puede leerla) | 7 dias | Renovar el Access Token silenciosamente |

**Flujo completo:**
```
Login (email+contraseÃ±a)
  -> Backend crea Access Token (15 min) + Refresh Token (7 dias)
  -> Access Token -> response.body.token (memoria frontend)
  -> Refresh Token -> cookie HttpOnly (inaccesible para JS)
  -> Frontend guarda token en React state + authFetch.tokenActual

Peticion a /mis-libros
  -> authFetch() envia Authorization: Bearer <token>

Access Token expira (15 min)
  -> Backend responde 401
  -> authFetch.refreshYReintentar() hace POST /refresh
    -> Cookie HttpOnly se envia automaticamente (credentials: 'include')
    -> Backend verifica, rota tokens, devuelve nuevo Access Token
  -> Reintenta la peticion original con el nuevo token

Logout
  -> POST /logout con Bearer token
  -> Backend revoca Refresh Token en la coleccion -> cookie eliminada
  -> Frontend limpia token de estado y authFetch
```

### 5.3 Refresh Token Rotation (RTR) + Deteccion de reutilizaciÃ³n

**Nuevo modelo `esquema_refresh_token.js`:**
```javascript
{
  token: String,        // JWT del refresh token
  usuarioId: ObjectId,  // Referencia al usuario
  familia: String,      // Grupo familiar de tokens (misma sesion)
  status: String,       // "active" | "used" | "revoked"
  createdAt: Date       // Auto-expira a los 30 dias
}
```

**Rotacion (RTR):** Cada vez que se usa un Refresh Token para renovar:
1. El token actual se marca como `"used"`
2. Se crea un nuevo token `"active"` con la misma `familia`
3. El viejo token ya no sirve aunque un atacante lo intercepte

**Deteccion de reutilizaciÃ³n (alerta de intrusion):**
Si el servidor recibe un token con status `"used"` (alguien intento reutilizar una llave vieja):
1. Asume que hubo una brecha de seguridad
2. Revoca TODOS los tokens de esa familia
3. Responde `401 "Sesion comprometida. Todos los dispositivos fueron desconectados."`
4. El usuario debe volver a iniciar sesion

**Revocacion activa (logout):**
- `logout.js` marca el Refresh Token como `"revoked"`
- La cookie se elimina con `clearCookie()`
- Cualquier intento de refresco con un token `"revoked"` -> 401

### 5.4 Backend - payload completo en el middleware

`autenticacion.js` ahora adjunta al request:
- `request.usuarioId` -> ID del usuario
- `request.usuarioRole` -> role (user / moderator / admin)
- `request.usuarioPermisos` -> objeto de permisos granular

Esto permite que los middlewares de autorizacion (`autorizacion.js`) y las rutas validen permisos sin consultar la base de datos nuevamente (validacion criptografica local, ultra rapida).

### 5.5 Frontend - simplificacion de authFetch

- Se elimino `setTokenRefresher` y el callback `onTokenChange`
- `authFetch.js` ahora es solo un modulo de utilidad que lee `tokenActual`
- `AuthContext.jsx` es la unica fuente de verdad del token
- Login/logout/refresh llaman directamente a `actualizarToken()` para sincronizar

### 5.6 Seguridad - ReDoS y NoSQL injection

**Problemas detectados:**
- `Autor.js` y `buscar_libros.js` usaban `new RegExp(input, "i")` con input de URL sin sanitizar -> ReDoS
- `id.js` usaba `findById(id)` sin validar que `id` fuera un ObjectId valido -> NoSQL injection

**Solucion:**
- Se creo `helpers/regex_utils.js` con funcion `escaparRegex()`
- `Autor.js`: input sanitizado, validacion de longitud maxima 100
- `buscar_libros.js`: input sanitizado, validacion de longitud maxima 100
- `id.js`: validacion con `mongoose.Types.ObjectId.isValid()`

### 5.7 Middleware de validacion generica

Se implemento `midleware/validar_campos.js` que recibe un schema de reglas y valida automaticamente los campos de `request.body`, `request.params` y `request.query`. Elimina los bloques repetitivos `if (!x) throw...` en cada endpoint. 10 endpoints fueron actualizados para usar este middleware.

### 5.8 Fusion de fetch files por dominio

Los 7 archivos de fetch del frontend se redujeron a 5, agrupados por dominio:
- `fetch/auth.js`: iniciarSesion, registrarUsuario, confirmarEmail
- `fetch/libros.js`: crearLibro, buscarLibros, editarLibro, obtenerMisLibros, removerLibro, eliminarLibro
- `fetch/cuenta.js`: solicitarCambioContrasena, restablecerContrasena
- `fetch/fetch_favoritos.js`: obtenerFavoritos, agregarFavorito, quitarFavorito
- `fetch/authFetch.js`: gestiÃ³n de tokens (sin cambios)

### 5.9 Soft delete y hard delete

- Anadido campo `activo` a `esquema_libro.js`
- `eliminar_libro.js`: soft delete (setea `activo: false`)
- `hard_delete_libro.js`: hard delete (elimina permanentemente)
- Todos los endpoints de busqueda filtran por `activo: true`
- Botones "Remover libro" (soft) y "Eliminar libro" (hard) en `MisLibros.jsx`, `Buscador.jsx` y `Perfil.jsx`

### 5.10 Endpoints de administracion

- `admin_usuarios.js`: CRUD basico para gestionar roles y permisos de usuarios
- Protegido con `autorizacion("admin")`
- Permite listar usuarios, cambiar roles individuales y modificar permisos granulares

---

## 6. Pendientes (Frontend)

Todo lo siguiente es backend que funciona, pero la interfaz frontend todavia no existe:

- [ ] Pagina de administracion de usuarios (`/admin/usuarios`) para listar, cambiar roles y permisos
- [ ] Ruta `/admin` protegida con `autorizacion("admin")` en el frontend
- [ ] Panel de moderacion (asignar moderadores a secciones/generos via `esquema_moderacion`)
- [ ] Dashboard admin con estadisticas de uso

---

## 7. Seed

El archivo `seed.js` crea 3 usuarios de prueba:

| Email | Contrasena | Role |
|---|---|---|
| admin@test.com | 123456 | admin |
| juan@test.com | 123456 | moderator |
| maria@test.com | 123456 | user |

Ejecutar con `node seed.js` desde el directorio `backend_bibloteca/`.


