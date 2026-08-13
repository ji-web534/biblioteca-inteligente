import USUARIO from "../esquemas/esquema_usuario.js"
import autenticacion from "../midleware/autenticacion.js"
import validarCampos from "../midleware/validar_campos.js"
import ServerError from "../helpers/error_class.js"
import { Router } from "express"

const router = Router()

router.put(
    "/profile",
    autenticacion,
    validarCampos({
        body: {
            nombre: {
                tipo: "string",
                max: 100,
                sanitizar: "trim",
                mensaje: "El nombre no es válido (máx. 100)."
            },
            email: {
                tipo: "string",
                max: 254,
                sanitizar: ["trim", "lowercase"],
                coincidir:
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                mensaje: "El email no es válido."
            }
        }
    }),
    async (request, response, next) => {
        try {
            const { nombre, email } = request.body

            const actualizaciones = {}
            if (nombre !== undefined) actualizaciones.nombre = nombre
            if (email !== undefined) actualizaciones.email = email

            if (Object.keys(actualizaciones).length === 0) {
                throw new ServerError(
                    "Debe enviar al menos un campo para actualizar.",
                    400
                )
            }

            const usuario = await USUARIO.findByIdAndUpdate(
                request.usuarioId,
                { $set: actualizaciones },
                { new: true, runValidators: true }
            ).select("-contraseña -permisos")

            if (!usuario) {
                throw new ServerError("Usuario no encontrado.", 404)
            }

            return response.json({
                ok: true,
                message: "Perfil actualizado con éxito.",
                data: usuario
            })
        } catch (error) {
            if (error.code === 11000) {
                return next(
                    new ServerError("El email ya está registrado.", 409)
                )
            }
            return next(error)
        }
    }
)

export default router
