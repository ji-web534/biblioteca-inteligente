import jwt from "jsonwebtoken"
import ENVIRONMENT from "../../config/environment.js"
import ServerError from "../helpers/error_class.js"

async function autenticacion(request, response, next) {
    try {
        const header = request.headers.authorization

        if (!header || !header.startsWith("Bearer ")) {
            throw new ServerError("Token de autenticación requerido.", 401)
        }

        const token = header.split(" ")[1]
        const decoded = jwt.verify(token, ENVIRONMENT.JWT_SECRET)

        request.usuarioId = decoded.id
        return next()
    } catch (error) {
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return next(new ServerError("Token inválido o expirado.", 401))
        }
        return next(error)
    }
}

export default autenticacion
