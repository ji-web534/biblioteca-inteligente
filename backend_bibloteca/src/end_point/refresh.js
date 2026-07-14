import USUARIO from "../esquemas/esquema_usuario.js"
import ServerError from "../helpers/error_class.js"
import jwt from "jsonwebtoken"
import ENVIRONMENT from "../../config/environment.js"
import { Router } from "express"

const router = Router()

router.post("/", async (request, response, next) => {
    try {
        const refreshToken = request.cookies?.refreshToken

        if (!refreshToken) {
            throw new ServerError("Refresh token no proporcionado.", 401)
        }

        let decoded
        try {
            decoded = jwt.verify(refreshToken, ENVIRONMENT.JWT_REFRESH_SECRET)
        } catch (error) {
            throw new ServerError("Refresh token inválido o expirado.", 401)
        }

        const usuario = await USUARIO.findById(decoded.id)

        if (!usuario) {
            throw new ServerError("Usuario no encontrado.", 401)
        }

        if (usuario.refreshToken !== refreshToken) {
            throw new ServerError("Refresh token revocado.", 401)
        }

        const newAccessToken = jwt.sign(
            {
                id: usuario._id,
                email: usuario.email,
                nombre: usuario.nombre,
                role: usuario.role
            },
            ENVIRONMENT.JWT_SECRET,
            { expiresIn: "15m" }
        )

        const newRefreshToken = jwt.sign(
            { id: usuario._id },
            ENVIRONMENT.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
        )

        usuario.refreshToken = newRefreshToken
        await usuario.save()

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