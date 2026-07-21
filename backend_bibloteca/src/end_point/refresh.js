import USUARIO from "../esquemas/esquema_usuario.js"
import REFRESH_TOKEN from "../esquemas/esquema_refresh_token.js"
import ServerError from "../helpers/error_class.js"
import jwt from "jsonwebtoken"
import ENVIRONMENT from "../../config/environment.js"
import { Router } from "express"
import crypto from "crypto"

const router = Router()

router.post("/", async (request, response, next) => {
    try {
        const refreshTokenCookie = request.cookies?.refreshToken

        if (!refreshTokenCookie) {
            throw new ServerError("Refresh token no proporcionado.", 401)
        }

        let decoded
        try {
            decoded = jwt.verify(refreshTokenCookie, ENVIRONMENT.JWT_REFRESH_SECRET)
        } catch (error) {
            throw new ServerError("Refresh token inválido o expirado.", 401)
        }

        const usuario = await USUARIO.findById(decoded.id)
        if (!usuario) {
            throw new ServerError("Usuario no encontrado.", 401)
        }

        const tokenDoc = await REFRESH_TOKEN.findOne({ token: refreshTokenCookie })

        if (!tokenDoc) {
            throw new ServerError("Refresh token no registrado.", 401)
        }

        if (tokenDoc.status === "revoked") {
            throw new ServerError("Sesión expirada.", 401)
        }

        if (tokenDoc.status === "used") {
            await REFRESH_TOKEN.updateMany(
                { familia: tokenDoc.familia, status: { $ne: "revoked" } },
                { status: "revoked" }
            )
            throw new ServerError("Sesión comprometida. Todos los dispositivos fueron desconectados.", 401)
        }

        tokenDoc.status = "used"
        await tokenDoc.save()

        const newAccessToken = jwt.sign(
            {
                id: usuario._id,
                email: usuario.email,
                nombre: usuario.nombre,
                role: usuario.role,
                permisos: usuario.permisos
            },
            ENVIRONMENT.JWT_SECRET,
            { expiresIn: "15m" }
        )

        const newRefreshToken = jwt.sign(
            { id: usuario._id },
            ENVIRONMENT.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
        )

        await REFRESH_TOKEN.create({
            token: newRefreshToken,
            usuarioId: usuario._id,
            familia: tokenDoc.familia,
            status: "active"
        })

        response.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.MODE === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return response.json({
            ok: true,
            token: newAccessToken
        })
    } catch (error) {
        return next(error)
    }
})

export default router