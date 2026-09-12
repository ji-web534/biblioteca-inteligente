// Único dueño del estado de sesión en el frontend.
// El access token viaja en cookie httpOnly (ilegible desde JS); aquí solo vive un flag
// para saber si corresponde intentar el refresh ante un 401.
let sesionActiva = false

export function haySesion() {
    return sesionActiva
}

export function marcarSesion() {
    sesionActiva = true
}

export function limpiarSesion() {
    sesionActiva = false
}
