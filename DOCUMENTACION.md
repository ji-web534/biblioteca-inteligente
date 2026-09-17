# Documentación - Biblioteca Inteligente

Proyecto web tipo "biblioteca en línea": los usuarios se registran, suben libros a un catálogo, los buscan, los marcan como favoritos y gestionan sus publicaciones. Incluye roles (`user`, `moderator`, `admin`) y permisos granulares, con panel de administración.

---

## 1. Estructura del proyecto

```
biblo/
├──── .git/
├──── postman/                          -> Colecciones de Postman para pruebas
├──── DOCUMENTACION.md                  <- Este archivo
│
├──── backend_bibloteca/                -> Servidor Express
│   ├──── .env                          -> Variables de entorno (no se commitea)
│   ├──── package.json
│   ├──── seed.js                       -> Script que crea usuarios de prueba
│   ├──── config/
│   │   ├──── environment.js            -> Lee .env y exporta objeto ENVIRONMENT
│   │   ├──── email_config.js            -> Inicializa cliente Resend
│   │   └──── cloudinary_config.js       -> Multer + Cloudinary (subida de portadas, 5 MB, MIME whitelist)
│   └──── src/
│       ├──── main.js                   -> Punto de entrada: Express, CORS, helmet, rutas, DB, listen
│       ├──── db/
│       │   └──── connect.js             -> Conexión Mongoose con fallback a MongoDB en memoria
│       ├──── end_point/                 -> Routers de Express (uno por recurso, nombres en inglés)
│       │   ├──── register.js            -> POST / (crear usuario, envía mail de confirmación)
│       │   ├──── confirmEmail.js         -> POST / (confirmar cuenta)
│       │   ├──── reenviarConfirmacion.js -> POST / (reenviar mail de confirmación, anti-enumeración)
│       │   ├──── login.js                -> POST / (exige email confirmado, setea 2 cookies httpOnly)
│       │   ├──── logout.js               -> POST / (revoca refresh por cookie, idempotente)
│       │   ├──── refresh.js              -> POST / (rota access + refresh tokens por cookie)
│       │   ├──── changePassword.js       -> POST /solicitar, POST /, POST /restablecer
│       │   ├──── createBook.js           -> POST / (crear libro)
│       │   ├──── searchBooks.js          -> GET /buscar (búsqueda + filtros + paginación)
│       │   ├──── myBooks.js              -> GET / (mis libros)
│       │   ├──── updateProfile.js        -> PUT /profile (nombre/email)
│       │   ├──── editBook.js             -> PUT /:id
│       │   ├──── restoreBook.js          -> PUT /:id/restore
│       │   ├──── deleteBook.js           -> DELETE /:id (soft delete)
│       │   ├──── hardDeleteBook.js       -> DELETE /:id/hard (eliminación permanente)
│       │   ├──── adminBooks.js           -> GET /, PUT /:id/restore (gestión de libros)
│       │   ├──── adminUsers.js           -> GET /, PUT /:id/role, PUT /:id/permisos
│       │   ├──── category.js             -> GET /, POST /, PUT /:id, DELETE /:id
│       │   ├──── favorites.js            -> GET /, POST /:libroId, DELETE /:libroId
│       │   ├──── upload_portada.js       -> POST / (subida firmada a Cloudinary, autenticado)
│       │   ├──── author.js               -> GET /:autor
│       │   └──── id.js                   -> GET /:id
│       ├──── esquemas/                 -> Modelos de Mongoose
│       │   ├──── esquema_libro.js         (incluye activo, timestamps, portada y enum de género)
│       │   ├──── esquema_usuario.js
│       │   ├──── esquema_categoria.js
│       │   └──── esquema_refresh_token.js (token, usuarioId, familia, status, timestamps)
│       ├──── helpers/
│       │   ├──── error_class.js          -> Clase ServerError
│       │   ├──── regex_utils.js          -> Función escaparRegex
│       │   ├──── verificar_jwt.js        -> Verificación central de JWT (HS256 fijo)
│       │   ├──── escapar_html.js         -> Escapa HTML para cuerpos de correo
│       │   ├──── email_confirmacion.js   -> Envía email de confirmación de cuenta
│       │   └──── email_cambio_contraseña.js -> Envía email de restablecimiento
│       ├──── midleware/                 -> Middlewares de Express
│       │   ├──── autenticacion.js        -> Verifica JWT desde cookie httpOnly
│       │   ├──── autorizacion.js         -> Roles y permisos (autorizacion, tienePermiso, puedeEditarLibro)
│       │   ├──── error_handler.js        -> Manejador global de errores
│       │   ├──── rate_limit.js           -> Limitadores por endpoint (ver 2.11)
│       │   ├──── libros_autenticador.js  -> Busca libro por nombre desde el body
│       │   ├──── check_passwords.js      -> Script de debug de contraseñas
│       │   ├──── check_users.js          -> Script de debug de usuarios
│       │   └──── validar_campos.js       -> Middleware de validación genérica por schema
│       └──── servicios/
│           └──── buscador_libros.js      -> POST / - busca libro por nombre
│
└──── frontend/                         -> Aplicación React + Vite
    ├──── package.json
    ├──── vite.config.ts
    ├──── tsconfig.json / tsconfig.app.json / tsconfig.node.json
    └──── src/
        ├──── main.tsx                  -> Renderiza <App> dentro de <BrowserRouter>
        ├──── App.tsx                    -> AuthProvider + definición de rutas
        ├──── index.css                  -> Estilos globales (tema "biblioteca clásica")
        ├──── assets/                    -> hero.png, etc.
        ├──── context/
        │   └──── AuthContext.jsx        -> Contexto de autenticación (usuario, sesión, login, logout)
        ├──── fetch/                     -> Llamadas a la API agrupadas por dominio
        │   ├──── tokenStore.js           -> Flag único de sesión (el token vive en cookie httpOnly)
        │   ├──── authFetch.js            -> fetch central con refresh automático (single-flight) y cookies
        │   ├──── auth.js                 -> iniciarSesion, registrarUsuario, confirmarEmail, reenviarVerificacion, updateProfile
        │   ├──── libros.js               -> crearLibro, buscarLibros, editarLibro, obtenerMisLibros, removerLibro, eliminarLibro, restaurarLibro
        │   ├──── favorites.js            -> obtenerFavoritos, agregarFavorito, quitarFavorito
        │   ├──── account.js              -> solicitarCambioContraseña, restablecerContraseña
        │   ├──── admin.js                -> obtenerUsuarios, cambiarRolUsuario, cambiarPermisosUsuario
        │   ├──── adminBooks.js           -> obtenerAdminLibros, restaurarLibroAdmin
        │   └──── helpers/error_class.js  -> Clase backendError
        └──── pantallas/               -> Componentes de página (nombres en inglés)
            ├──── Home.jsx, Register.jsx, Login.jsx, NewBook.jsx, BookSearch.jsx, BookDetail.jsx
            ├──── ChangePassword.jsx, ConfirmAccount.jsx
            ├──── AdminUsers.jsx, AdminBooks.jsx, AdminCategories.jsx
            └──── profile/               -> Perfil en layout con subvistas
                ├──── ProfileLayout.jsx   (MisLibros, Favoritos, EditarPerfil)
                ├──── MisLibros.jsx
                ├──── Favoritos.jsx
                └──── EditarPerfil.jsx
```

---

## 2. Backend

### 2.1 Rutas de la API

Todas las rutas se montan en `src/main.js` bajo distintos prefijos.

| Ruta base                              | Archivo                | Endpoints                                                       | Auth |
|----------------------------------------|------------------------|-----------------------------------------------------------------|------|
| `/app/bibilo/nuevo_usuario`            | `register.js`          | POST `/`                                                        | No   |
| `/app/bibilo/verificacion`             | `confirmEmail.js`      | POST `/`                                                        | No   |
| `/app/bibilo/reenviar-verificacion`    | `reenviarConfirmacion.js` | POST `/`                                                    | No   |
| `/app/bibilo/login`                    | `login.js`             | POST `/`                                                        | No   |
| `/app/bibilo/logout`                   | `logout.js`            | POST `/`                                                        | Cookie |
| `/app/bibilo/refresh`                  | `refresh.js`           | POST `/`                                                        | Cookie |
| `/app/bibilo/cambiar-contraseña`       | `changePassword.js`    | `POST /solicitar`, `POST /`, `POST /restablecer`                | Variable |
| `/app/bibilo/nuevo_libro`              | `createBook.js`        | POST `/`                                                        | Cookie |
| `/app/bibilo/libros`                   | `searchBooks.js`       | GET `/buscar` (búsqueda + filtros + paginación)                 | No   |
| `/app/bibilo/libro`                    | `editBook.js`          | PUT `/:id`                                                      | Cookie + puede editar |
| `/app/bibilo/libro`                    | `restoreBook.js`       | PUT `/:id/restore`                                              | Cookie + dueño O `can_delete_books` |
| `/app/bibilo/libro`                    | `deleteBook.js`        | DELETE `/:id` (soft delete)                                     | Cookie + dueño O `can_delete_books` |
| `/app/bibilo/libro`                    | `hardDeleteBook.js`    | DELETE `/:id/hard` (permanente)                                 | Cookie + dueño O `can_delete_books` |
| `/app/bibilo/mis-libros`               | `myBooks.js`           | GET `/` (paginado)                                              | Cookie |
| `/app/bibilo/favoritos`                | `favorites.js`         | GET `/`, POST `/:libroId`, DELETE `/:libroId`                   | Cookie |
| `/app/bibilo/categorias`               | `category.js`          | GET `/`, POST `/`, PUT `/:id`, DELETE `/:id`                    | GET: No; resto: Cookie + `can_manage_categories` |
| `/app/bibilo/autor/`                   | `author.js`            | GET `/:autor`                                                   | No   |
| `/app/bibilo/admin/libros`             | `adminBooks.js`        | GET `/`, PUT `/:id/restore` (gestión libros)                    | Cookie + `can_delete_books` |
| `/app/bibilo/admin/usuarios`           | `adminUsers.js`        | GET `/`, PUT `/:id/role`, PUT `/:id/permisos`                   | Cookie + admin |
| `/app/bibilo/profile`                  | `updateProfile.js`     | PUT `/` (con sesión de `/app/bibilo/profile`)                    | Cookie |
| `/app/bibilo/portada`                  | `upload_portada.js`    | POST `/` (FormData `imagen`) → Cloudinary                       | Cookie |
| `/app/bibilo/`                         | `id.js`                | GET `/:id`                                                      | No   |
| `/app/bibilo/buscador`                 | `buscador_libros.js`   | POST `/` (servicio)                                             | No   |

> Nota: `editBook.js` permite editar el propio libro sin permiso extra; si el libro es de otro usuario exige `can_edit_others_books`. `deleteBook.js`/`hardDeleteBook.js`/`restoreBook.js` permiten operar sobre el propio libro (dueño) ó con `can_delete_books` (ver 2.9).

**Endpoints de cambio de contraseña** (`/app/bibilo/cambiar-contraseña`):

- `POST /solicitar` — requiere `{ email }`. Busca el usuario en DB y envía el correo con enlace de restablecimiento. Devuelve **siempre** la misma respuesta genérica (para no enumerar emails).
- `POST /` — requiere `{ nuevaContraseña }`. **Autenticado** (cookie). Cambia la contraseña del usuario identificado por `request.usuarioId` (id del token), sin pedir la actual.
- `POST /restablecer` — requiere `{ token, nuevaContraseña }`. Verifica el JWT (helper `verificarJWT`), busca al usuario por email y actualiza la contraseña.

> Ambas rutas que reciben contraseña validan `min: 6, max: 72` (límite de bcrypt) en `validarCampos`, antes de hashear.

**Búsqueda con filtros y paginación** (`GET /app/bibilo/libros/buscar`):

Query params opcionales: `q` (texto), `genero`, `autor`, `desde` (fecha `YYYY-MM-DD`), `hasta`, `page` (default 1), `limit` (default 20, máx 50). Devuelve `{ ok, data, pagination: { page, limit, total, totalPages } }`. El filtro de fecha se aplica sobre el campo `createdAt` (timestamps). Solo devuelve libros con `activo: true`.

**Endpoints de administración:**

- `GET /app/bibilo/admin/usuarios` — lista todos los usuarios sin contraseña. Solo admin.
- `PUT /app/bibilo/admin/usuarios/:id/role` — cambia el role. Requiere `{ role }`. Solo admin.
- `PUT /app/bibilo/admin/usuarios/:id/permisos` — cambia permisos granulares. Requiere `{ permisos }`. Solo admin.
- `GET /app/bibilo/admin/libros?eliminados=true|false` — lista libros (por defecto activos; con `eliminados=true` lista los soft-eliminados para poder restaurarlos). Requiere permiso `can_delete_books`.
- `PUT /app/bibilo/admin/libros/:id/restore` — vuelve `activo` un libro eliminado.
- `GET /app/bibilo/categorias` — lista categorías (público). `POST`/`PUT`/`DELETE` requieren `can_manage_categories`.
- `POST /app/bibilo/portada` — recibe `FormData` con campo `imagen` (máx 5 MB, MIME whitelist) y devuelve la URL firmada de Cloudinary.

**Roles disponibles:** `user`, `moderator`, `admin`.

**Permisos granulares:** `can_delete_books`, `can_edit_others_books`, `can_manage_categories`, `can_suspend_users`, `can_manage_users`.

### 2.2 Flujo de autenticación

- **Registro:** `POST /app/bibilo/nuevo_usuario`. El backend valida campos (nombre máx 50, email con regex y máx 254, contraseña 6-72), hashea la contraseña con bcrypt, guarda en MongoDB con `confirm: false` y envía un correo de confirmación.
- **Confirmación:** `POST /app/bibilo/verificacion` con el token del enlace `/confirmar-cuenta?token=...` (ver 2.7). Marca `confirm: true`. La respuesta es genérica (no filtra si el usuario existe).
- **Reenvío:** `POST /app/bibilo/reenviar-verificacion` con `{ email }`. Solo reenvía si el email existe y está sin confirmar; la respuesta es siempre la misma (anti-enumeración).
- **Login:** `POST /app/bibilo/login` verifica email+contraseña con bcrypt. **Exige `confirm: true`** (si no, responde 403 "Debes verificar tu correo..."). No devuelve ningún token en el body: setea **dos cookies httpOnly**:
  - `accessToken` (JWT, payload `{ id, email, nombre, role, permisos }`, 15 min).
  - `refreshToken` (JWT `{ id }`, 7 días), persistido en la tabla `esquema_refresh_token` con `familia` y `status`.
  - Ambas con `SameSite: strict`, `secure` en producción (`MODE=production`).
- **Sesión en frontend:** `AuthContext` mantiene `usuario` (de localStorage) y un flag `sesion`. Tras cargar revalida la sesión llamando `/refresh` (la cookie llega sola, sin header). `tokenStore.js` guarda solo el flag (`haySesion`/`marcarSesion`/`limpiarSesion`); el token no es legible desde JS.
- **Peticiones autenticadas:** `authFetch(url, opts)` con `credentials: 'include'`. No envía `Authorization`: el backend lee la cookie `accessToken`.
- **Refresh automático (single-flight):** si el backend responde 401 y hay sesión, `authFetch` espera a **una única** llamada a `/refresh` compartida (la primera la crea, las demás la reutilizan) y reintenta la petición. Evita que N refresh simultáneos marquen el token como `used` y disparen la revocación de familia.
- **Rotación de refresh:** cada `/refresh` marca el token anterior como `used` y emite uno nuevo de la misma `familia`. Si llega un token ya `used`, se revoca toda la familia ("Sesión comprometida", 401). *Es el mecanismo de detección de robo de refresh token.*
- **Logout:** `AuthContext.logout()` limpia usuario/flag y llama `POST /logout` con `credentials: 'include'`. El backend revoca todos los refresh del `usuarioId` (derivado de la cookie, o fallback por token en DB) y limpia ambas cookies.

### 2.3 Middleware de autenticación y autorización

- `autenticacion.js`: lee el JWT de la **cookie `accessToken`** (httpOnly), lo verifica con `verificarJWT` (helper central, algoritmo fijo `HS256`) y adjunta al `request`:
  - `request.usuarioId`
  - `request.usuarioRole`
  - `request.usuarioPermisos`
- `autorizacion.js` (exporta `autorizacion`, `tienePermiso`, `puedeEditarLibro`):
  - `autorizacion("admin")` — exige rol específico (busca el usuario en DB, valida su `role`).
  - `tienePermiso("can_delete_books")` — exige un permiso granular; los `admin` siempre pasan.
  - `puedeEditarLibro` — regla "dueño del libro O con permiso". Se usa dentro de los handlers de `editBook`, `deleteBook`, `restoreBook` y `hardDeleteBook` (no como middleware de cadena) para no bloquear al dueño.
  - Los permisos individuales (`tienePermiso`) se aplican en los handlers de admin y categorías. En delete/restore/hardDelete el dueño siempre puede operar su libro aunque no tenga `can_delete_books`.

### 2.4 Flujo de envío de correos

Usa **Resend** como proveedor (`config/email_config.js`).

- **Confirmación de cuenta** (`email_confirmacion.js`): genera JWT `{ email }` (exp. 1h), construye `{URL_FRONTEND}/confirmar-cuenta?token=...` y envía desde `onboarding@resend.dev`. Escapa HTML del nombre.
- **Cambio de contraseña** (`email_cambio_contraseña.js`): genera JWT `{ email }` (exp. 1h), construye `{URL_FRONTEND}/cambiar-contrasena?token=...` y envía el correo. Escapa HTML del nombre.

### 2.5 Flujo de cambio de contraseña

1. Usuario pulsa "Cambiar contraseña" → `solicitarCambioContraseña(email)` → `POST /cambiar-contraseña/solicitar` → busca el usuario y envía `enviarEmailCambioContraseña` (respuesta genérica siempre).
2. Usuario recibe el correo y abre el enlace `http://localhost:5173/cambiar-contrasena?token=...` (ruta de `App.tsx` que renderiza `ChangePassword.jsx`; lee `?token=` con `useSearchParams`).
3. Usuario ingresa y confirma la nueva contraseña → `restablecerContraseña(token, nuevaContraseña)` → `POST /cambiar-contraseña/restablecer`, que verifica el JWT, busca al usuario y actualiza la contraseña.

> Rutas del frontend: `/confirmar-cuenta` y `/cambiar-contrasena` ya existen y coinciden con los enlaces generados por el backend.

### 2.6 Conexión a la base de datos

En `src/db/connect.js`:

- Intenta conectar a MongoDB usando `MONGODB_URI` del `.env` (actualmente `mongodb://localhost:27017/`).
- Si falla y la URI contiene `localhost`/`127.0.0.1`, usa **mongodb-memory-server** (base en memoria).
- Si se define `USE_MEMORY_DB=true`, fuerza la base en memoria.
- Si no se define `MONGODB_URI`, construye la URI desde `MONGO_DB_CONNECTION_STRING` y `MONGO_DB_NAME`.

### 2.7 Manejo de errores

- Clase `ServerError` (`helpers/error_class.js`): extiende `Error` con una propiedad `status` (código HTTP).
- Middleware `error_handler.js` captura:
  - `ServerError` → devuelve su `status` y `message`.
  - Errores de MongoDB/Mongoose (`MongoNetworkError`, etc.) → `503` con mensaje genérico.
  - `ValidationError`/`CastError` → `400` genérico ("Los datos enviados no son válidos.").
  - Errores genéricos → `500` con mensaje genérico al cliente. En producción se loguea solo `error.name` y `error.message` (sin stack ni datos sensibles); en dev se loguea el error completo.

### 2.8 Middleware de validación genérica

Archivo: `midleware/validar_campos.js`.

Recibe un schema con reglas por campo (`body`, `params`, `query`). Cada campo puede tener:

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `requerido` | boolean | El campo debe estar presente y no vacío |
| `tipo` | string | `"string"`, `"number"`, `"objectId"` |
| `min` | number | Longitud mínima (string) o valor mínimo (number) |
| `max` | number | Longitud máxima (string) o valor máximo (number) |
| `coincidir` | RegExp | Patrón regex que debe coincidir |
| `sanitizar` | string/array | Operaciones: `"trim"`, `"escaparRegex"`, `"lowercase"` |
| `mensaje` | string | Mensaje personalizado |

Si algo falla lanza un `ServerError` capturado por el `error_handler` global.

Ejemplo:

```js
router.post("/", validarCampos({
    body: {
        email: { requerido: true, tipo: "string", sanitizar: ["trim", "lowercase"], coincidir: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, mensaje: "El email no es válido." },
        contraseña: { requerido: true, tipo: "string", min: 6, max: 72, mensaje: "La contraseña no es válida." }
    }
}), handler)
```

### 2.9 Soft delete, hard delete y restauración de libros

- **Esquema de libro** (`esquema_libro.js`): campos `nombre`, `genero` (enum `["terror", "fantasia", "romance"]`, máx 15), `autor`, `descripcion`, `usuarioId`, `portada` (URL de Cloudinary), `activo: { type: Boolean, default: true }` y timestamps automáticos (`createdAt`, `updatedAt`) mediante `{ timestamps: true }`.
- **Soft delete** (`deleteBook.js` → `DELETE /:id`): **dueño O `can_delete_books`**. Marca `activo: false`. Los endpoints de búsqueda (search, author, my-books, id, favoritos) filtran por `activo: true`.
- **Hard delete** (`hardDeleteBook.js` → `DELETE /:id/hard`): **dueño O `can_delete_books`**. Elimina definitivamente el documento con `deleteOne()`.
- **Restauración** (`restoreBook.js` → `PUT /:id/restore`): **dueño O `can_delete_books`**. Vuelve `activo: true` un libro previamente soft-eliminado. Disponible en `AdminBooks.jsx`.

### 2.10 Paginación

Los endpoints `searchBooks.js`, `myBooks.js` y `adminBooks.js` aceptan `page` (default 1) y `limit` (default 20, máx 50) y devuelven `{ data, pagination: { page, limit, total, totalPages } }`. El frontend muestra controles Anterior/Siguiente y el total de resultados.

### 2.11 Rate limiting

Definidos en `midleware/rate_limit.js` (factory `hacerLimite`). Se aplican en `main.js` a los endpoints sensibles:

| Limiter | Ventana | Máx | Endpoint |
|---------|---------|-----|----------|
| `limitarLogin` | 15 min | 5 | `POST /login` |
| `limitarRegistro` | 60 min | 5 | `POST /nuevo_usuario` |
| `limitarSolicitudPassword` | 60 min | 5 | `POST /cambiar-contraseña/solicitar` y `/restablecer` |
| `limitarRefresh` | 15 min | 30 | `POST /refresh` |
| `limitarVerificacion` | 60 min | 10 | `POST /verificacion` |
| `limitarReenvioVerificacion` | 60 min | 5 | `POST /reenviar-verificacion` |

Además, `express.json({ limit: "100kb" })` corta cuerpos gigantes y `helmet` (con `contentSecurityPolicy: false` y `crossOriginResourcePolicy: false`) aplica cabeceras de seguridad. CORS restringe a `ENVIRONMENT.URL_FRONTEND ?? "http://localhost:5173"` con `credentials: true`.

---

## 3. Frontend

### 3.1 Ruta del frontend

Definidas en `App.tsx` con React Router:

| Ruta                  | Componente       | Descripción                                             |
|-----------------------|------------------|---------------------------------------------------------|
| `/`                   | Home             | Principal (cambia según auth)                            |
| `/registro`           | Register         | Formulario de registro                                   |
| `/nuevo-usuario`      | Register         | Alias de registro                                        |
| `/iniciar-sesion`     | Login            | Inicio de sesión (+ boton reenviar verificación)          |
| `/nuevo-libro`        | NewBook          | Altas de libro + portada                                  |
| `/perfil`             | ProfileLayout    | Perfil con subvistas (MisLibros, Favoritos, EditarPerfil) |
| `/buscador`           | BookSearch       | Búsqueda con filtros en el catálogo                    |
| `/libro/:id`          | BookDetail       | Detalle de un libro                                     |
| `/admin/usuarios`     | AdminUsers       | Gestionar roles y permisos (admin)                       |
| `/admin/libros`       | AdminBooks       | Gestionar libros, incluye restaurar eliminados           |
| `/admin/categorias`   | AdminCategories  | Gestionar categorías (admin)                             |
| `/cambiar-contrasena`  | ChangePassword   | Restablecer contraseña (lee `?token=`)                    |
| `/confirmar-cuenta`   | ConfirmAccount   | Confirmar cuenta (lee `?token=`)                          |

### 3.2 Arquitectura

- Sin SSR: ruteo del lado del cliente con React Router.
- Sin librería de estado: solo React Context (`AuthContext`).
- TypeScript nominal + código JSX: el proyecto usa tsconfig con `allowJs: true` y los componentes están en `.jsx`.
- CSS en un solo archivo `index.css` con variables (tema "biblioteca clásica").
- Fetch helpers por dominio en `frontend/fetch/`.
- El access token **no** vive en JS: se manda por cookie httpOnly; `tokenStore.js` guarda solo el flag de sesión.

### 3.3 Funciones de `fetch/`

| Archivo        | Funciones                                     |
|----------------|----------------------------------------------|
| `tokenStore.js` | `haySesion`, `marcarSesion`, `limpiarSesion` (flag de sesión en memoria) |
| `authFetch.js` | `API`, `authFetch` (cookies + refresh single-flight automático) |
| `auth.js`      | `iniciarSesion`, `registrarUsuario`, `confirmarEmail`, `reenviarVerificacion`, `updateProfile` |
| `libros.js`    | `crearLibro`, `buscarLibros(termino, filtros, page, limit)`, `editarLibro`, `obtenerMisLibros(page, limit)`, `removerLibro`, `eliminarLibro`, `restaurarLibro` |
| `favorites.js` | `obtenerFavoritos`, `agregarFavorito`, `quitarFavorito` |
| `account.js`   | `solicitarCambioContraseña`, `restablecerContraseña` |
| `admin.js`     | `obtenerUsuarios`, `cambiarRolUsuario`, `cambiarPermisosUsuario` |
| `adminBooks.js`| `obtenerAdminLibros(eliminados, page, limit)`, `restaurarLibroAdmin` |

### 3.4 Componentes (pantallas)

| Componente      | Funcionalidad |
|-----------------|---------------|
| `Home.jsx`      | Principal. Autenticado: saludo, links y botones admin (roles/gestión libros si tiene permiso), cambiar contraseña, cerrar sesión. No autenticado: links a login/registro. |
| `Login.jsx`     | Formulario email+contraseña. `AuthContext.login()` → `/perfil`. Muestra el error 403 de cuenta sin verificar y ofrece reenviar el mail (`reenviarVerificacion`). |
| `Register.jsx`  | Formulario de registro. `registrarUsuario()`. |
| `NewBook.jsx`   | Formulario nombre+descripción+portada. `crearLibro()`. |
| `ProfileLayout.jsx` | Layout del perfil con subvistas (MisLibros, Favoritos, EditarPerfil). |
| `MisLibros.jsx` | Lista de libros del usuario con favorito, remover (soft), eliminar (hard) y restaurar. Paginado. |
| `Favoritos.jsx` | Lista de favoritos con botón para quitar. |
| `EditarPerfil.jsx` | Edición de nombre/email vía `updateProfile`. |
| `BookSearch.jsx` | Búsqueda sobre el catálogo con filtros (texto, género, autor, fecha desde/hasta) y paginación. |
| `BookDetail.jsx` | Detalle de un libro por id. |
| `ChangePassword.jsx` | Lee `?token=`. Formulario de nueva contraseña + confirmación. |
| `ConfirmAccount.jsx` | Lee `?token=`. Confirma la cuenta. |
| `AdminUsers.jsx` | Lista usuarios, cambia roles y permisos (switches granulares). |
| `AdminBooks.jsx` | Lista libros (activos o eliminados), restaura eliminados. Paginado. |
| `AdminCategories.jsx` | Alta/baja/edición de categorías. |

---

## 4. Problemas conocidos

- El backend en modo local necesita MongoDB (o el fallback en memoria que tarda en arrancar la primera vez).
- En local con `MODE=development` las cookies no llevan flag `Secure`, por lo que funcionan sobre `http://localhost`. En producción (`MODE=production`) el flag `Secure` exige HTTPS.
- Las claves reales de Cloudinary/Resend/JWT viven en el `.env` local y no se commitean; al desplegar hay que rotarlas y setearlas por ambiente.

### 4.1 Observaciones de seguridad abiertas

> La migración a cookies httpOnly (access en cookie, rotación con detección de familia, single-flight en refresh) cerró las líneas principales. Quedan observaciones menores:

1. **Timing attack en `POST /cambiar-contraseña/solicitar`** (`changePassword.js`) — la respuesta siempre es genérica (200), pero el tiempo de respuesta **difiere** si el email existe (hace `findOne` + envía correo) vs no existe (solo `findOne`). Un atacante podría **enumerar emails** midiendo el tiempo de respuesta. *Arreglo sugerido:* normalizar el tiempo (p. ej. aplicar un pequeño `await` artificial cuando no existe, o responder siempre de forma idéntica). Severidad: baja/media.
2. **`POST /login` da 404 si no hay usuarios en DB** — `login.js` chequea `countDocuments() === 0` y responde 404 indicando que se ejecute el seed. Esto revela el estado de la base. *Arreglo sugerido:* responder siempre "Credenciales inválidas." Severidad: baja (solo visible en instalación vacía).

---

## 5. Cambios recientes

1. **Autenticación por cookies httpOnly**: access token dejó de viajar en el body/headers; login y refresh setean cookies `accessToken` (15 min) y `refreshToken` (7 d) con `SameSite: strict`. `autenticacion.js` lee solo la cookie. Frontend con `tokenStore.js` (flag de sesión) y `authFetch` con `credentials: 'include'`.
2. **Rotación de refresh con detección de robo**: familia de tokens en `esquema_refresh_token`; un refresh reutilizado revoca toda la familia ("Sesión comprometida").
3. **Refresh single-flight** en `authFetch.js`: una única llamada a `/refresh` compartida entre todos los 401 concurrentes, evitando revocaciones accidentales en picos de requests.
4. **Gate de email verificado**: `login` responde 403 si `confirm === false`. Nuevo endpoint `POST /reenviar-verificacion` (con rate limit y respuesta anti-enumeración) + botón de reenvío en `Login.jsx`.
5. **Validación endurecida en credenciales**: contraseñas `min: 6, max: 72` (bcrypt), email con regex y `max: 254`, nombre `max: 50` (register), mismas reglas en `changePassword` y `updateProfile`.
6. **Rate limiting por endpoint**: login, registro, refresh, verificación, reenvío y solicitud/restablecimiento de contraseña.
7. **Portadas con Cloudinary**: subida firmada desde el backend (`upload_portada.js` + `cloudinary_config.js`), endpoint protegido, `multer` con límite de 5 MB y whitelist MIME.
8. **Permisos granulares aplicados**: delete/restore/hardDelete con regla "dueño O `can_delete_books`"; categorías con `can_manage_categories`; `adminUsers` sin exponer el hash bcrypt.
9. **Error handler robusto**: errores de DB → 503, ValidationError/CastError → 400 genérico, 500 genérico con log sanitizado en producción.
10. **Renombrado backend/frontend a inglés**: todos los archivos `end_point/` y las pantallas del frontend pasaron a nombres en inglés.

---

## 6. Pendientes

- [ ] Tests automatizados (backend y frontend).
- [ ] Dashboard de administrador con estadísticas de uso.
- [ ] Singleton/actualización en caliente del catálogo (reindexación) al editar/eliminar.
- [ ] Completar observaciones de 4.1 (timing attack en `/solicitar`, 404 en login sin usuarios).

---

## 7. Seed

El archivo `seed.js` crea 3 usuarios de prueba:

| Email            | Contraseña | Role      |
|------------------|------------|-----------|
| `admin@test.com` | `123456`   | `admin`   |
| `juan@test.com`  | `123456`   | `moderator` |
| `maria@test.com` | `123456`   | `user`     |

Todos los usuarios de seed se crean con `confirm: true` (el gate de login no los bloquea). Ejecutar con `node seed.js` desde el directorio `backend_bibloteca/`.