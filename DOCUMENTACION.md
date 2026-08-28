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
│   ├──── .env                          -> Variables de entorno
│   ├──── package.json
│   ├──── seed.js                       -> Script que crea usuarios de prueba
│   ├──── config/
│   │   ├──── environment.js            -> Lee .env y exporta objeto ENVIRONMENT
│   │   └──── email_config.js            -> Inicializa cliente Resend
│   └──── src/
│       ├──── main.js                   -> Punto de entrada: Express, CORS, rutas, DB, listen
│       ├──── db/
│       │   └──── connect.js             -> Conexión Mongoose con fallback a MongoDB en memoria
│       ├──── end_point/                 -> Routers de Express (uno por recurso, nombres en inglés)
│       │   ├──── register.js            -> POST / (crear usuario)
│       │   ├──── confirmEmail.js         -> POST / (confirmar cuenta)
│       │   ├──── login.js                -> POST /
│       │   ├──── logout.js               -> POST /
│       │   ├──── refresh.js              -> POST /
│       │   ├──── changePassword.js       -> POST /solicitar, POST /, POST /restablecer
│       │   ├──── createBook.js           -> POST / (crear libro)
│       │   ├──── searchBooks.js          -> GET /buscar (búsqueda + filtros + paginación)
│       │   ├──── myBooks.js              -> GET / (mis libros)
│       │   ├──── editBook.js             -> PUT /:id
│       │   ├──── restoreBook.js          -> PUT /:id/restore
│       │   ├──── deleteBook.js           -> DELETE /:id (soft delete)
│       │   ├──── hardDeleteBook.js       -> DELETE /:id/hard (eliminación permanente)
│       │   ├──── adminBooks.js           -> GET /, PUT /:id/restore (gestión de libros)
│       │   ├──── adminUsers.js           -> GET /, PUT /:id/role, PUT /:id/permisos
│       │   ├──── favorites.js            -> GET /, POST /:libroId, DELETE /:libroId
│       │   ├──── author.js               -> GET /:autor
│       │   └──── id.js                   -> GET /:id
│       ├──── esquemas/                 -> Modelos de Mongoose
│       │   ├──── esquema_libro.js         (incluye activo y timestamps)
│       │   ├──── esquema_usuario.js
│       │   ├──── esquema_moderacion.js
│       │   └──── esquema_refresh_token.js
│       ├──── helpers/
│       │   ├──── error_class.js          -> Clase ServerError
│       │   ├──── regex_utils.js          -> Función escaparRegex
│       │   ├──── email_confirmacion.js   -> Envía email de confirmación de cuenta
│       │   └──── email_cambio_contraseña.js -> Envía email de restablecimiento
│       ├──── midleware/                 -> Middlewares de Express
│       │   ├──── autenticacion.js        -> Verifica JWT Bearer token
│       │   ├──── autorizacion.js         -> Middleware de roles y permisos (autorizacion, tienePermiso, puedeEditarLibro)
│       │   ├──── check_passwords.js      -> Script de debug de contraseñas
│       │   ├──── check_users.js          -> Script de debug de usuarios
│       │   ├──── error_handler.js        -> Manejador global de errores
│       │   ├──── libros_autenticador.js  -> Busca libro por nombre desde el body
│       │   ├──── validar_campos.js     -> Middleware de validación genérica por schema
│       │   └──── verificar_usuario.js    -> Busca usuario por email desde el body
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
        │   └──── AuthContext.jsx        -> Contexto de autenticación (token, usuario, login, logout)
        ├──── fetch/                     -> Llamadas a la API agrupadas por dominio
        │   ├──── authFetch.js            -> Módulo central de fetch con JWT y refresh automático
        │   ├──── auth.js                 -> iniciarSesion, registrarUsuario, confirmarEmail
        │   ├──── libros.js               -> crearLibro, buscarLibros, editarLibro, obtenerMisLibros, removerLibro, eliminarLibro, restaurarLibro
        │   ├──── favorites.js            -> obtenerFavoritos, agregarFavorito, quitarFavorito
│   ├──── account.js                -> solicitarCambioContraseña, restablecerContraseña
│   ├──── admin.js                  -> obtenerUsuarios, cambiarRolUsuario, cambiarPermisosUsuario
│   ├──── adminBooks.js             -> obtenerAdminLibros, restaurarLibroAdmin
        │   └──── helpers/error_class.js  -> Clase backendError
        └──── pantallas/               -> Componentes de página (nombres en inglés)
            ├──── Home.jsx, Login.jsx, Register.jsx, NewBook.jsx, Profile.jsx
            ├──── BookSearch.jsx, MyBooks.jsx, Favorites.jsx
            ├──── ChangePassword.jsx, ConfirmAccount.jsx
            ├──── AdminUsers.jsx, AdminBooks.jsx
```

---

## 2. Backend

### 2.1 Rutas de la API

Todas las rutas se montan en `src/main.js` bajo distintos prefijos.

| Ruta base                              | Archivo           | Endpoints                                          | Auth |
|----------------------------------------|-------------------|----------------------------------------------------|------|
| `/app/bibilo/nuevo_usuario`            | `register.js`     | POST `/`                                           | No   |
| `/app/bibilo/verificacion`             | `confirmEmail.js` | POST `/`                                           | No   |
| `/app/bibilo/login`                    | `login.js`        | POST `/`                                           | No   |
| `/app/bibilo/logout`                   | `logout.js`       | POST `/`                                           | JWT  |
| `/app/bibilo/refresh`                  | `refresh.js`      | POST `/`                                           | Cookie |
| `/app/bibilo/cambiar-contraseña`       | `changePassword.js` | `POST /solicitar`, `POST /`, `POST /restablecer` | Variable |
| `/app/bibilo/nuevo_libro`              | `createBook.js`   | POST `/`                                           | JWT  |
| `/app/bibilo/libros`                   | `searchBooks.js`  | GET `/buscar` (búsqueda + filtros + paginación)    | No   |
| `/app/bibilo/libro`                    | `editBook.js`     | PUT `/:id`                                         | JWT + puede editar |
| `/app/bibilo/libro`                    | `restoreBook.js`  | PUT `/:id/restore`                               | JWT + `can_delete_books` |
| `/app/bibilo/libro`                    | `deleteBook.js`   | DELETE `/:id` (soft delete)                      | JWT + `can_delete_books` |
| `/app/bibilo/libro`                    | `hardDeleteBook.js` | DELETE `/:id/hard` (permanente)                  | JWT + `can_delete_books` |
| `/app/bibilo/mis-libros`               | `myBooks.js`      | GET `/` (paginado)                              | JWT  |
| `/app/bibilo/favoritos`                | `favorites.js`    | GET `/`, POST `/:libroId`, DELETE `/:libroId`     | JWT  |
| `/app/bibilo/autor/`                    | `author.js`        | GET `/:autor`                                  | No   |
| `/app/bibilo/admin/libros`              | `adminBooks.js`    | GET `/`, PUT `/:id/restore` (gestión libros)     | JWT + `can_delete_books` |
| `/app/bibilo/admin/usuarios`            | `adminUsers.js`    | GET `/`, PUT `/:id/role`, PUT `/:id/permisos`     | JWT + admin |
| `/app/bibilo/`                           | `id.js`            | GET `/:id`                                    | No   |
| `/app/bibilo/buscador`                  | `buscador_libros.js` | POST `/` (servicio)                           | No   |

> Nota: `editBook.js` permite editar el propio libro sin permiso extra; si el libro es de otro usuario exige `can_edit_others_books`. `deleteBook.js`/`hardDeleteBook.js`/`restoreBook.js` exigen `can_delete_books` (ver 2.9).

**Endpoints de cambio de contraseña** (`/app/bibilo/cambiar-contraseña`):

- `POST /solicitar` — requiere `{ email }`. Busca el usuario en DB y envía el correo con enlace de restablecimiento. Devuelve **siempre** la misma respuesta genérica (para no enumerar emails).
- `POST /` — requiere `{ nuevaContrasena }`. **Autenticado** (JWT). Cambia la contraseña del usuario identificado por `request.usuarioId` (id del token), sin pedir la actual.
- `POST /restablecer` — requiere `{ token, nuevaContrasena }`. Verifica el JWT (helper `verificarJWT`), busca al usuario por email y actualiza la contraseña.

**Búsqueda con filtros y paginación** (`GET /app/bibilo/libros/buscar`):

Query params opcionales: `q` (texto), `genero`, `autor`, `desde` (fecha `YYYY-MM-DD`), `hasta`, `page` (default 1), `limit` (default 20, máx 50). Devuelve `{ ok, data, pagination: { page, limit, total, totalPages } }`. El filtro de fecha se aplica sobre el campo `createdAt` (timestamps). Solo devuelve libros con `activo: true`.

**Endpoints de administración:**

- `GET /app/bibilo/admin/usuarios` — lista todos los usuarios sin contraseña. Solo admin.
- `PUT /app/bibilo/admin/usuarios/:id/role` — cambia el role. Requiere `{ role }`. Solo admin.
- `PUT /app/bibilo/admin/usuarios/:id/permisos` — cambia permisos granulares. Requiere `{ permisos }`. Solo admin.
- `GET /app/bibilo/admin/libros?eliminados=true|false` — lista libros (por defecto activos; con `eliminados=true` lista los soft-eliminados para poder restaurarlos). Requiere permiso `can_delete_books`.
- `PUT /app/bibilo/admin/libros/:id/restore` — vuelve `activo` un libro eliminado.

**Roles disponibles:** `user`, `moderator`, `admin`.

**Permisos granulares:** `can_delete_books`, `can_edit_others_books`, `can_manage_categories`, `can_suspend_users`, `can_manage_users`.

### 2.2 Flujo de autenticación

- **Registro:** `POST /app/bibilo/nuevo_usuario`. El backend hashea la contraseña con bcrypt, guarda en MongoDB y envía un correo de notificación para confirmar la cuenta.
- **Confirmación:** `POST /app/bibilo/verificacion` con el token extraído del enlace `/confirmar-cuenta?token=...` (ver 2.7).
- **Login:** `POST /app/bibilo/login` verifica email+contraseña con bcrypt y devuelve:
  - **Access Token (JWT)** en el body — payload `{ id, email, nombre, role, permisos }`, dura 15 min.
  - **Refresh Token** en cookie HttpOnly — dura 7 días.
  - `AuthContext.login()` guarda el token en estado y llama `actualizarToken()` para sincronichiarlo con `authFetch.js`.
- **Sesión:** `AuthContext` redefine estado desde `localStorage` al montar. `estaAutenticado` deriva de `!!token`.
- **Peticiones autenticadas:** se usa `authFetch(url, opts)` en lugar de `fetch()`. Envía `Authorization: Bearer <token>`.
- **Refresh automático:** si el backend responde 401 y existe token, `authFetch` hace `POST /refresh` (cookie incluida) y reintenta la petición *(RTR — ver 5.3)*.
- **Logout:** `AuthContext.logout()` limpia token/usuario del estado y `localStorage`, y llama a `POST /logout` para revocar el refresh token.

### 2.3 Middleware de autenticación y autorización

- `autenticacion.js`: extrae el Bearer token, lo verifica con `jwt.verify(JWT_SECRET)` y adjunta al `request`:
  - `request.usuarioId`
  - `request.usuarioRole`
  - `request.usuarioPermisos`
- `autorizacion.js` (exporta `autorizacion`, `tienePermiso`, `esModeradorContexto`):
  - `autorizacion("admin")` — exige rol específico (busca el usuario en DB, valida su `role`).
  - `tienePermiso("can_delete_books")` — exige un permiso granular; los `admin` siempre pasan.
  - `esModeradorContexto(contexto, contextoId)` — valida moderación por contexto usando `esquema_moderacion`.

### 2.4 Flujo de envío de correos

Usa **Resend** como proveedor (`config/email_config.js`).

- **Confirmación de cuenta** (`email_confirmacion.js`): genera JWT `{ email }` (exp. 1h), construye `{URL_FRONTEND}/confirmar-cuenta?token=...` y envía desde `onboarding@resend.dev`.
- **Cambio de contraseña** (`email_cambio_contraseña.js`): genera JWT `{ email }` (exp. 1h), construye `{URL_FRONTEND}/cambiar-contrasena?token=...` y envía el correo.

### 2.5 Flujo de cambio de contraseña

1. Usuario pulsa "Cambiar contraseña" → `solicitarCambioContraseña(email)` → `POST /cambiar-contraseña/solicitar` → busca el usuario y envía `enviarEmailCambioContraseña` (respuesta genérica siempre).
2. Usuario recibe el correo y abre el enlace `http://localhost:5173/cambiar-contrasena?token=...` (ruta de `App.tsx` que renderiza `ChangePassword.jsx`; lee `?token=` con `useSearchParams`).
3. Usuario ingresa y confirma la nueva contraseña → `restablecerContraseña(token, nuevaContrasena)` → `POST /cambiar-contraseña/restablecer`, que verifica el JWT, busca al usuario y actualiza la contraseña.

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
  - Errores de MongoDB/Mongoose → `503` o `400`.
  - Errores genéricos → `500`.

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
router.post("/", verificarUsuario, validarCampos({
    body: {
        nombre: { requerido: true, tipo: "string", min: 1, max: 100, sanitizar: "trim" },
        email: { requerido: true, tipo: "string", sanitizar: ["trim", "lowercase"] }
    }
}), handler)
```

### 2.9 Soft delete, hard delete y restauración de libros

- **Esquema de libro** (`esquema_libro.js`): campos `nombre`, `genero`, `autor`, `descripcion`, `usuarioId`, `activo: { type: Boolean, default: true }` y timestamps automáticos (`createdAt`, `updatedAt`) mediante `{ timestamps: true }`.
- **Soft delete** (`deleteBook.js` → `DELETE /:id`): `JWT` + `can_delete_books`. Marca `activo: false`. Los endpoints de búsqueda (search, author, my-books, id, favoritos) filtran por `activo: true`.
- **Hard delete** (`hardDeleteBook.js` → `DELETE /:id/hard`): `JWT` + `can_delete_books`. Elimina definitivamente el documento con `deleteOne()`.
- **Restauración** (`restoreBook.js` → `PUT /:id/restore`): `JWT` + `can_delete_books`. Vuelve `activo: true` un libro previamente soft-eliminado. Disponible en `AdminBooks.jsx` (y en `MyBooks.jsx`, `BookSearch.jsx`, `Profile.jsx` cuando corresponde).

### 2.10 Paginación

Los endpoints `searchBooks.js`, `myBooks.js` y `adminBooks.js` aceptan `page` (default 1) y `limit` (default 20, máx 50) y devuelven `{ data, pagination: { page, limit, total, totalPages } }`. El frontend muestra controles Anterior/Siguiente y el total de resultados.

---

## 3. Frontend

### 3.1 Ruta del frontend

Definidas en `App.tsx` con React Router:

| Ruta                  | Componente       | Descripción                                             |
|-----------------------|------------------|---------------------------------------------------------|
| `/`                   | Home             | Principal (cambia según auth)                            |
| `/registro`           | Register         | Formulario de registro                                   |
| `/nuevo-usuario`      | Register         | Alias de registro                                        |
| `/iniciar-sesion`     | Login            | Inicio de sesión                                         |
| `/nuevo-libro`        | NewBook          | Altas de libro                                            |
| `/perfil`             | Profile          | Perfil del usuario (mis libros + favoritos)              |
| `/buscador`           | BookSearch       | Búsqueda con filtros en el catálogo                    |
| `/admin/usuarios`     | AdminUsers       | Gestionar roles y permisos (admin)                       |
| `/admin/libros`       | AdminBooks       | Gestionar libros, incluye restaurar eliminados           |
| `/cambiar-contrasena`  | ChangePassword   | Restablecer contraseña (lee `?token=`)                    |
| `/confirmar-cuenta`   | ConfirmAccount   | Confirmar cuenta (lee `?token=`)                          |

### 3.2 Arquitectura

- Sin SSR: ruteo del lado del cliente con React Router.
- Sin librería de estado: solo React Context (`AuthContext`).
- TypeScript nominal + código JSX: el proyecto usa tsconfig con `allowJs: true` y los componentes están en `.jsx`.
- CSS en un solo archivo `index.css` con variables (tema "biblioteca clásica").
- Fetch helpers por dominio en `frontend/fetch/`.

### 3.3 Funciones de `fetch/`

| Archivo        | Funciones                                     |
|----------------|----------------------------------------------|
| `authFetch.js` | `actualizarToken`, `authFetch` (refresh automático), `getToken` |
| `auth.js`      | `iniciarSesion`, `registrarUsuario`, `confirmarEmail` |
| `libros.js`    | `crearLibro`, `buscarLibros(termino, filtros, page, limit)`, `editarLibro`, `obtenerMisLibros(page, limit)`, `removerLibro`, `eliminarLibro`, `restaurarLibro` |
| `favorites.js` | `obtenerFavoritos`, `agregarFavorito`, `quitarFavorito` |
| `account.js`   | `solicitarCambioContraseña`, `restablecerContraseña` |
| `admin.js`     | `obtenerUsuarios`, `cambiarRolUsuario`, `cambiarPermisosUsuario` |
| `adminBooks.js`| `obtenerAdminLibros(eliminados, page, limit)`, `restaurarLibroAdmin` |

### 3.4 Componentes (pantallas)

| Componente      | Funcionalidad |
|-----------------|---------------|
| `Home.jsx`      | Principal. Autenticado: saludo, links y botones admin (roles/gestión libros si tiene permiso), cambiar contraseña, cerrar sesión. No autenticado: links a login/registro. |
| `Login.jsx`     | Formulario email+contraseña. `AuthContext.login()` → `/perfil`. |
| `Register.jsx`  | Formulario de registro. `registrarUsuario()`. |
| `NewBook.jsx`   | Formulario nombre+descripción. `crearLibro()`. |
| `Profile.jsx`   | Datos del usuario, tabla "Mis Libros" y "Favoritos", con remover/eliminar/restaurar. Cerrar sesión. |
| `BookSearch.jsx` | Búsqueda sobre el catálogo con filtros (texto, género, autor, fecha desde/hasta) y paginación. |
| `MyBooks.jsx`   | Lista de libros del usuario con favorito, remover (soft), eliminar (hard) y restaurar. Paginado. |
| `Favorites.jsx` | Lista de favoritos con botón para quitar. |
| `ChangePassword.jsx` | Lee `?token=`. Formulario de nueva contraseña + confirmación. |
| `ConfirmAccount.jsx` | Lee `?token=`. Confirma la cuenta. |
| `AdminUsers.jsx` | Lista usuarios, cambia roles y permisos. |
| `AdminBooks.jsx` | Lista libros (activos o eliminados), restaura eliminados. Paginado. |

---

## 4. Problemas conocidos

- `DOCUMENTACION.md` incluye notas del estado en construcción; revisar el apartado 6 para las features pendientes.
- El backend en modo local necesita MongoDB (o el fallback en memoria que tarda en arrancar la primera vez).
- Algunos componentes (p.ej. `BookSearch.jsx`) mantienen funciones/estado sin uso claro (restaurar libro dentro de vistas que filtran por `activo`).
- En `Profile.jsx` y otras vistas, los botones de restaurar no se muestran porque las listas filtran `activo: true`; la restauración se hace desde el panel de administración.

### 4.1 Bugs de seguridad pendientes de arreglar (detectados en auditoría)

> Estado: los fixes críticos (verificación de JWT en `confirmEmail`, autenticación en `changePassword`, eliminación de logs sensibles, mensajes de error genéricos en `error_handler`) ya se aplicaron. Quedan estas **observaciones menores** documentadas para revisar más adelante:

1. **Timing attack en `POST /cambiar-contraseña/solicitar`** (`changePassword.js`) — la respuesta siempre es genérica (200), pero el tiempo de respuesta **difiere** si el email existe (hace `findOne` + envía correo) vs no existe (solo `findOne`). Un atacante podría **enumerar emails** midiendo el tiempo de respuesta. *Arreglo sugerido:* normalizar el tiempo (p. ej. aplicar un pequeño `await` artificial cuando no existe, o eliminar el acceso a DB cuando no hay email y responder siempre de forma idéntica). Severidad: baja/media.

2. **`error_handler.js` no loguea en producción** (`MODE === "production"`) — en dev se hace `console.error("[ERROR]", error)`, pero en producción **no se registra nada** del error desconocido en el servidor, lo que dificulta diagnosticar fallas reales en producción. *Arreglo sugerido:* loguear en producción **solo** el `error.name` y `error.message` (sin datos del body/usuario), por ejemplo vía `console.error` o un logger estructurado. Severidad: baja (disponibilidad de diagnóstico).

3. **Enumeración residual en `confirmEmail.js`** — si el email del JWT de confirmación no existe en DB, devuelve `404 "No se encontró un usuario con ese email."`. Para explotarlo el atacante necesita forjar un JWT firmado (requiere `JWT_SECRET`), por lo que **no es explotable de forma real** hoy; no obstante, es una diferencia de patrón frente a los demás flujos de email (que devuelven respuesta genérica). *Arreglo sugerido (opcional):* devolver la misma respuesta genérica de éxito aunque no exista el usuario. Severidad: muy baja (requiere secret).

---

## 5. Cambios recientes

1. **Renombrado backend/frontend a inglés**: todos los archivos `end_point/` y las pantallas del frontend pasaron a nombres en inglés (`registro_usuario.js -> register.js`, `Nuevo_libro.jsx -> NewBook.jsx`, `Buscador.jsx -> BookSearch.jsx`, ...).
2. **Paginación**: en `searchBooks.js`, `myBooks.js` y `adminBooks.js` + controles en `MyBooks.jsx`, `BookSearch.jsx`, `AdminBooks.jsx`.
3. **Filtros avanzados de búsqueda**: por género, autor y rango de fechas (`desde`/`hasta`) sobre `createdAt`. Se añadió `{ timestamps: true }` al esquema de libro.
4. **Restauración de libros**: endpoint `restoreBook.js`, `PUT /:id/restore` + panel `AdminBooks.jsx` con lista de eliminados.
5. **Panel de administración de usuarios**: `AdminUsers.jsx` + endpoints `adminUsers.js`.
6. **Gestión de autorización**: `autorizacion.js` expuso `autorizacion()`, `tienePermiso()` y helpers de edición.

---

## 6. Pendientes

- [ ] Panel de moderación (asignar moderadores a secciones/géneros mediante `esquema_moderacion`).
- [ ] Dashboard de administrador con estadísticas de uso.
- [ ] Cargar edición de permisos por moderador.
- [ ] Tests automatizados (backend y frontend).

---

## 7. Seed

El archivo `seed.js` crea 3 usuarios de prueba:

| Email            | Contraseña | Role      |
|------------------|------------|-----------|
| `admin@test.com` | `123456`   | `admin`   |
| `juan@test.com`  | `123456`   | `moderator` |
| `maria@test.com` | `123456`   | `user`     |

Ejecutar con `node seed.js` desde el directorio `backend_bibloteca/`.