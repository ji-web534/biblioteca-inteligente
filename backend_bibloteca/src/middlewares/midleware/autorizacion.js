import USUARIO from "../esquemas/esquema_usuario.js"
import ServerError from "../helpers/error_class.js"

const autorizacion = (...rolesPermitidos) => {
    return async (request, response, next) => {
        try {
            const usuario = await USUARIO.findById(request.usuarioId)

            if (!usuario) {
                throw new ServerError("Usuario no encontrado.", 404)
            }

            if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(usuario.role)) {
                throw new ServerError("No tiene permisos para realizar esta acción.", 403)
            }

            request.usuario = usuario
            request.usuarioRole = usuario.role
            request.usuarioPermisos = usuario.permisos

            return next()
        } catch (error) {
            return next(error)
        }
    }
}

const tienePermiso = (permiso) => {
    return async (request, response, next) => {
        try {
            if (!request.usuario) {
                const usuario = await USUARIO.findById(request.usuarioId)
                if (!usuario) throw new ServerError("Usuario no encontrado.", 404)
                request.usuario = usuario
            }

            if (request.usuario.role === "admin") {
                return next()
            }

            if (request.usuario.permisos && request.usuario.permisos[permiso]) {
                return next()
            }

            throw new ServerError(`No tiene el permiso: ${permiso}`, 403)
        } catch (error) {
            return next(error)
        }
    }
}

export { autorizacion, tienePermiso }