import USUARIO from "../esquemas/esquema_usuario.js"
import ServerError from "../helpers/error_class.js"

async function verificarUsuario(request, response, next) {
    try {
        const { email } = request.body

        if (!email) {
            throw new ServerError("El email es obligatorio.", 400)
        }

        const usuario = await USUARIO.findOne({ email: email.toLowerCase().trim() })

        if (!usuario) {
            throw new ServerError("No se encontró un usuario con ese email.", 404)
        }

        response.locals.usuario = usuario
        return next()
    } catch (error) {
        return next(error)
    }
}

export default verificarUsuario
