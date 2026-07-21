import crypto from "crypto"
import USUARIO from "../esquemas/esquema_usuario.js"
import REFRESH_TOKEN from "../esquemas/esquema_refresh_token.js"
import ServerError from "../helpers/error_class.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import ENVIRONMENT from "../../config/environment.js"
import { Router } from "express"

const router = Router()

router.post("/", async (request, response, next) => {
    try {
        const { email, contraseña } = request.body

        if (!email || !contraseña) {
            throw new ServerError("Email y contraseña son obligatorios.", 400)
        }

        const usuario = await USUARIO.findOne({ email: email.toLowerCase().trim() })

        if (!usuario) {
            throw new ServerError("Credenciales inválidas.", 401)
        }

        const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña)
        if (!contraseñaValida) {
            throw new ServerError("Credenciales inválidas.", 401)
        }

        const token = jwt.sign(
            { id: usuario._id, email: usuario.email, nombre: usuario.nombre, role: usuario.role, permisos: usuario.permisos },
            ENVIRONMENT.JWT_SECRET,
            { expiresIn: "15m" }
        )

        const refreshToken = jwt.sign(
            { id: usuario._id },
            ENVIRONMENT.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
        )

        const familia = crypto.randomUUID()

        await REFRESH_TOKEN.create({
            token: refreshToken,
            usuarioId: usuario._id,
            familia,
            status: "active"
        })

        response.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.MODE === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        const usuarioData = usuario.toObject()
        delete usuarioData.contraseña
        delete usuarioData.refreshToken

        return response.json({
            ok: true,
            message: "Sesión iniciada correctamente.",
            token,
            data: usuarioData
        })
    } catch (error) {
        return next(error)
    }
})

export default router
