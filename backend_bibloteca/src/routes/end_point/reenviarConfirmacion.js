import USUARIO from "../esquemas/esquema_usuario.js"
import { Router } from "express"
import enviarEmailConfirmacion from "../helpers/email_confirmacion.js"
import validarCampos from "../midleware/validar_campos.js"

const router = Router()

router.post("/", validarCampos({
    body: {
        email: { requerido: true, tipo: "string", sanitizar: ["trim", "lowercase"], mensaje: "El email no es válido." }
    }
}), async (request, response, next) => {
    try {
        const { email } = request.body

        const usuario = await USUARIO.findOne({ email })

        if (usuario && !usuario.confirm) {
            try {
                await enviarEmailConfirmacion(usuario.nombre, usuario.email)
            } catch (mailError) {
                console.error("Error al reenviar el mail de confirmación:", mailError?.message)
            }
        }

        return response.json({
            ok: true,
            message: "Si el correo existe y no está verificado, recibirás un nuevo enlace de confirmación."
        })
    } catch (error) {
        return next(error)
    }
})

export default router