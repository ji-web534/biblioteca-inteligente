import REFRESH_TOKEN from "../esquemas/esquema_refresh_token.js"
import ENVIRONMENT from "../../config/environment.js"
import jwt from "jsonwebtoken"
import { Router } from "express"

const router = Router()

router.post("/", async (request, response, next) => {
    try {
        const refreshTokenCookie = request.cookies?.refreshToken

        if (refreshTokenCookie) {
            let usuarioId = null

            try {
                const decoded = jwt.verify(refreshTokenCookie, ENVIRONMENT.JWT_REFRESH_SECRET, {
                    algorithms: ["HS256"]
                })
                usuarioId = decoded.id
            } catch {
                const tokenDoc = await REFRESH_TOKEN.findOne({ token: refreshTokenCookie })
                usuarioId = tokenDoc?.usuarioId || null
            }

            if (usuarioId) {
                await REFRESH_TOKEN.updateMany(
                    { usuarioId },
                    { status: "revoked" }
                )
            }
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