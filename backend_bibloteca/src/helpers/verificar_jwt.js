import jwt from "jsonwebtoken"
import ENVIRONMENT from "../../config/environment.js"
import ServerError from "./error_class.js"

export default function verificarJWT(token) {
    if (!token) {
        throw new ServerError("Token requerido.", 401)
    }

    try {
        return jwt.verify(token, ENVIRONMENT.JWT_SECRET)
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            throw new ServerError("Token expirado.", 401)
        }
        if (error.name === "JsonWebTokenError") {
            throw new ServerError("Token inválido.", 401)
        }
        throw error
    }
}
