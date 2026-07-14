import USUARIO from "../esquemas/esquema_usuario.js"
import autenticacion from "../midleware/autenticacion.js"
import { Router } from "express"

const router = Router()

router.post("/", autenticacion, async (request, response, next) => {
    try {
        const usuario = await USUARIO.findById(request.usuarioId)

        if (usuario) {
            usuario.refreshToken = null
            await usuario.save()
        }

        response.clearCookie("refreshToken")

        return response.json({
            ok: true,
            message: "Sesión cerrada correctamente."
        })
    } catch (error) {
        return next(error)
    }
})

export default router