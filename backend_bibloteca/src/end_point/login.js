import crypto from "crypto"
import USUARIO from "../esquemas/esquema_usuario.js"
import REFRESH_TOKEN from "../esquemas/esquema_refresh_token.js"
import ServerError from "../helpers/error_class.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import ENVIRONMENT from "../../config/environment.js"
import { Router } from "express"
import validarCampos from "../midleware/validar_campos.js"

const router = Router()

const SEED_EMAILS = ["admin@test.com", "juan@test.com", "maria@test.com"]

router.post("/", validarCampos({
    body: {
        email: { requerido: true, tipo: "string", sanitizar: ["trim", "lowercase"], mensaje: "Email y contraseña son obligatorios." },
        contraseña: { requerido: true, tipo: "string", mensaje: "Email y contraseña son obligatorios." }
    }
}), async (request, response, next) => {
    try {
        const { email, contraseña } = request.body

        if (SEED_EMAILS.includes(email)) {
            console.log(`[DEBUG SEED] Login attempt: ${email}`)
        }

        const totalUsuarios = await USUARIO.countDocuments()
    if (totalUsuarios === 0) {
        throw new ServerError("No hay usuarios registrados en la base de datos. Ejecuta el script de seed.", 404)
    }

    const usuario = await USUARIO.findOne({ email })

        if (!usuario) {
            if (SEED_EMAILS.includes(email)) {
                console.log(`[DEBUG SEED] Usuario no encontrado en DB: ${email}`)
            }
            throw new ServerError("Credenciales inválidas.", 401)
        }

        const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña)
        if (!contraseñaValida) {
            if (SEED_EMAILS.includes(email)) {
                console.log(`[DEBUG SEED] Contraseña incorrecta para: ${email}`)
                console.log(`[DEBUG SEED] Hash almacenado: ${usuario.contraseña?.substring(0, 30)}...`)
            }
            throw new ServerError("Credenciales inválidas.", 401)
        }

        if (SEED_EMAILS.includes(email)) {
            console.log(`[DEBUG SEED] Login exitoso: ${email}`)
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
