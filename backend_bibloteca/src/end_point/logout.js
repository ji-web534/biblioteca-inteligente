import REFRESH_TOKEN from "../esquemas/esquema_refresh_token.js"
import autenticacion from "../midleware/autenticacion.js"
import { Router } from "express"

const router = Router()

router.post("/", autenticacion, async (request, response, next) => {
    try {
        const refreshTokenCookie = request.cookies?.refreshToken

        if (refreshTokenCookie) {
            await REFRESH_TOKEN.updateMany(
                { usuarioId: request.usuarioId },
                { status: "revoked" }
            )
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