import ServerError from "../helpers/error_class.js"
import verificarJWT from "../helpers/verificar_jwt.js"

async function autenticacion(request, response, next) {
    try {
        const header = request.headers.authorization

        if (!header || !header.startsWith("Bearer ")) {
            throw new ServerError("Token de autenticación requerido.", 401)
        }

        const token = header.split(" ")[1]
        const decoded = verificarJWT(token)

        request.usuarioId = decoded.id
        request.usuarioRole = decoded.role
        request.usuarioPermisos = decoded.permisos || {}
        return next()
    } catch (error) {
        return next(error)
    }
}

export default autenticacion
