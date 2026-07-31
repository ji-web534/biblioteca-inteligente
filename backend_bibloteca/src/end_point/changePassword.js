import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Router } from "express"
import USUARIO from "../esquemas/esquema_usuario.js"
import ServerError from "../helpers/error_class.js"
import ENVIRONMENT from "../../config/environment.js"
import verificarUsuario from "../midleware/verificar_usuario.js"
import validarCampos from "../midleware/validar_campos.js"
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

router.post("/", verificarUsuario, validarCampos({
    body: { nuevaContraseña: { requerido: true, tipo: "string", min: 6, mensaje: "La nueva contraseña es obligatoria." } }
}), async (request, response, next) => {
    try {
        const { nuevaContraseña } = request.body
        const usuario = response.locals.usuario

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

router.post("/restablecer", validarCampos({
    body: {
        token: { requerido: true, tipo: "string", mensaje: "Token y nueva contraseña son obligatorios." },
        nuevaContraseña: { requerido: true, tipo: "string", min: 6, mensaje: "Token y nueva contraseña son obligatorios." }
    }
}), async (request, response, next) => {
    try {
        const { token, nuevaContraseña } = request.body

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
