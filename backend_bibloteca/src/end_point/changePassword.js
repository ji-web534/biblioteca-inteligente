import USUARIO from "../esquemas/esquema_usuario.js"
import ServerError from "../helpers/error_class.js"
import { Router } from "express"
import autenticacion from "../midleware/autenticacion.js"
import validarCampos from "../midleware/validar_campos.js"
import enviarEmailCambioContraseña from "../helpers/email_cambio_contraseña.js"

const router = Router()

router.post("/solicitar", validarCampos({
    body: { email: { requerido: true, tipo: "string", sanitizar: ["trim", "lowercase"], mensaje: "El email no es válido." } }
), async (request, response, next) => {
    try {
        const { email } = request.body

        // Siempre buscamos el usuario, pero respondemos siempre igual (anti-enumeración)
        const usuario = await USUARIO.findOne({ email })

        if (usuario) {
            try {
                await enviarEmailCambioContraseña(usuario.nombre, usuario.email)
            } catch (mailError) {
                // Error de envío ignorado: response siempre es el mismo
            }
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
), async (request, response, next) => {
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
), async (request, response, next) => {
    try {
        const { token, nuevaContraseña } = request.body

        // Verificar JWT con el helper centralizado
        const { default: verificarJWT } = await import("../helpers/verificar_jwt.js")
        const decoded = await verificarJWT(token)

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