import USUARIO from "../esquemas/esquema_usuario.js"
import ServerError from "../helpers/error_class.js"
import { Router } from "express"
import bcrypt from "bcrypt"
import enviarEmailConfirmacion from "../helpers/email_confirmacion.js"
import validarCampos from "../midleware/validar_campos.js"

const router = Router()

router.post("/", validarCampos({
    body: {
        nombre: { requerido: true, tipo: "string", min: 1, sanitizar: "trim", mensaje: "El nombre no es válido." },
        email: { requerido: true, tipo: "string", sanitizar: ["trim", "lowercase"], mensaje: "El email no es válido." },
        contraseña: { requerido: true, tipo: "string", min: 6, mensaje: "La contraseña no es válida." }
    }
}), async (request, response, next) => {
    try {
        const { email, contraseña, nombre } = request.body

        const hashedPassword = await bcrypt.hash(contraseña, 10)

        const nuevoUsuario = new USUARIO({
            nombre,
            email,
            contraseña: hashedPassword,
        })

        await nuevoUsuario.save()

        try {
            await enviarEmailConfirmacion(nuevoUsuario.nombre, nuevoUsuario.email)
        } catch (mailError) {
            console.error("Error al enviar el mail de confirmación:", mailError)
        }

        const usuarioGuardado = nuevoUsuario.toObject()
        delete usuarioGuardado.contraseña

        return response.status(201).json({
            ok: true,
            message: "Usuario creado y guardado con éxito. Por favor, verifica tu correo electrónico.",
            data: usuarioGuardado,
        })

    } catch (error) {
        if (error.code === 11000) {
            return next(new ServerError("Ese email ya está registrado.", 400))
        }

        return next(error)
    }
})

export default router
