import rateLimit from "express-rate-limit"

// Factory para no repetir la estructura de cada limitador.
const hacerLimite = (windowMs, max, mensaje) => rateLimit({
    windowMs,
    max,
    message: { message: mensaje },
    standardHeaders: true,
    legacyHeaders: false
})

export const limitarLogin = hacerLimite(
    15 * 60 * 1000,
    5,
    "Demasiados intentos de inicio de sesión. Intenta de nuevo en unos minutos."
)

export const limitarRegistro = hacerLimite(
    60 * 60 * 1000,
    5,
    "Demasiados registros desde esta IP. Intenta más tarde."
)

export const limitarSolicitudPassword = hacerLimite(
    60 * 60 * 1000,
    5,
    "Demasiadas solicitudes de cambio de contraseña. Intenta más tarde."
)

export const limitarRefresh = hacerLimite(
    15 * 60 * 1000,
    30,
    "Demasiadas peticiones de refresco de sesión. Intenta de nuevo en unos minutos."
)
