import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Router } from "express"
import USUARIO from "../esquemas/esquema_usuario.js"
import ServerError from "../helpers/error_class.js"
import ENVIRONMENT from "../../config/environment.js"
import verificarUsuario from "../midleware/verificar_usuario.js"
import enviarEmailCambioContraseña from "../helpers/email_cambio_contraseña.js"

const router = Router()

router.post("/solicitar", verificarUsuario, async (request, response, next) => {
    try {
        const usuario = response.locals.usuario

        await enviarEmailCambioContraseña(usuario.nombre, usuario.email)

        return response.json({
            ok: true,
            message: "Si el email está registrado, recibirás un correo para restablecer tu contraseña."
        })
    } catch (error) {
        return next(error)
    }
})

router.post("/", verificarUsuario, async (request, response, next) => {
    try {
        const { contraseñaActual, nuevaContraseña } = request.body
        const usuario = response.locals.usuario

        if (!contraseñaActual || !nuevaContraseña) {
            throw new ServerError("La contraseña actual y la nueva son obligatorias.", 400)
        }

        if (nuevaContraseña.length < 6) {
            throw new ServerError("La nueva contraseña debe tener al menos 6 caracteres.", 400)
        }

        const contraseñaValida = await bcrypt.compare(contraseñaActual, usuario.contraseña)
        if (!contraseñaValida) {
            throw new ServerError("La contraseña actual no es correcta.", 401)
        }

        const hashedPassword = await bcrypt.hash(nuevaContraseña, 10)
        usuario.contraseña = hashedPassword
        await usuario.save()

        return response.json({
            ok: true,
            message: "Contraseña actualizada correctamente."
        })
    } catch (error) {
        return next(error)
    }
})

router.post("/restablecer", async (request, response, next) => {
    try {
        const { token, nuevaContraseña } = request.body

        if (!token || !nuevaContraseña) {
            throw new ServerError("Token y nueva contraseña son obligatorios.", 400)
        }

        if (nuevaContraseña.length < 6) {
            throw new ServerError("La contraseña debe tener al menos 6 caracteres.", 400)
        }

        const decoded = jwt.verify(token, ENVIRONMENT.JWT_SECRET)
        const email = decoded.email

        const usuario = await USUARIO.findOne({ email })
        if (!usuario) {
            throw new ServerError("Usuario no encontrado.", 404)
        }

        const hashedPassword = await bcrypt.hash(nuevaContraseña, 10)
        usuario.contraseña = hashedPassword
        await usuario.save()

        return response.json({
            ok: true,
            message: "Contraseña restablecida correctamente."
        })
    } catch (error) {
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return next(new ServerError("El enlace ha expirado o es inválido.", 401))
        }
        return next(error)
    }
})

export default router
