import ServerError from "../helpers/error_class.js"
import verificarJWT from "../helpers/verificar_jwt.js"

async function autenticacion(request, response, next) {
    try {
        const header = request.headers.authorization
        const tokenCookie = request.cookies?.accessToken
        const tokenHeader = header && header.startsWith("Bearer ") ? header.split(" ")[1] : null
        const token = tokenCookie || tokenHeader

        if (!token) {
            throw new ServerError("Token de autenticación requerido.", 401)
        }

        const decoded = verificarJWT(token)

        if (!decoded || !decoded.id) {
            throw new ServerError("Token inválido.", 401)
        }

        request.usuarioId = decoded.id
        request.usuarioRole = decoded.role
        request.usuarioPermisos = decoded.permisos || {}
        return next()
    } catch (error) {
        return next(error)
    }
}

export default autenticacion
