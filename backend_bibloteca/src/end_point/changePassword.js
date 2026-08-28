import bcrypt from "bcrypt"
import { Router } from "express"
import USUARIO from "../esquemas/esquema_usuario.js"
import ServerError from "../helpers/error_class.js"
import autenticacion from "../midleware/autenticacion.js"
import verificarJWT from "../helpers/verificar_jwt.js"
import { limitarSolicitudPassword } from "../midleware/rate_limit.js"
import validarCampos from "../midleware/validar_campos.js"
import enviarEmailCambioContraseña from "../helpers/email_cambio_contraseña.js"

const router = Router()

router.post("/solicitar", limitarSolicitudPassword, validarCampos({
    body: { email: { requerido: true, tipo: "string", sanitizar: ["trim", "lowercase"], mensaje: "El email no es válido." } }
}), async (request, response, next) => {
    try {
        const { email } = request.body
        const usuario = await USUARIO.findOne({ email })

        if (usuario) {
            await enviarEmailCambioContraseña(usuario.nombre, usuario.email)
        }

        return response.json({
            ok: true,
            message: "Si el email está registrado, recibirás un correo para restablecer tu contraseña."
        })
    } catch (error) {
        return next(error)
    }
})

router.post("/", autenticacion, validarCampos({
    body: { nuevaContraseña: { requerido: true, tipo: "string", min: 6, mensaje: "La nueva contraseña es obligatoria." } }
}), async (request, response, next) => {
    try {
        const { nuevaContraseña } = request.body
        const usuario = await USUARIO.findById(request.usuarioId)

        if (!usuario) {
            throw new ServerError("Usuario no encontrado.", 404)
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

router.post("/restablecer", validarCampos({
    body: {
        token: { requerido: true, tipo: "string", mensaje: "Token y nueva contraseña son obligatorios." },
        nuevaContraseña: { requerido: true, tipo: "string", min: 6, mensaje: "Token y nueva contraseña son obligatorios." }
    }
}), async (request, response, next) => {
    try {
        const { token, nuevaContraseña } = request.body
        const decoded = verificarJWT(token)

        const usuario = await USUARIO.findOne({ email: decoded.email })
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
        return next(error)
    }
})

export default router
