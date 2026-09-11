// Único dueño del token de acceso en el frontend.
// Si mañana cambia el almacenamiento (memoria, cookie, etc.), se edita solo este archivo.
let tokenActual = null

export function getToken() {
    return tokenActual
}

export function setToken(nuevoToken) {
    tokenActual = nuevoToken
}

export function clearToken() {
    tokenActual = null
}
