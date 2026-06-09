import USUARIO from "../esquemas/esquema_usuario.js"
import ServerError from "../helpers/error_class.js"
import { Router } from "express"
import bcrypt from "bcrypt"

const router = Router()

router.post("/", async (request, response, next) => {
    try {
        const { email, contraseña, nombre } = request.body

        if (!nombre) {
            throw new ServerError("El nombre no es válido.", 400)
        }

        if (!email) {
            throw new ServerError("El email no es válido.", 400)
        }

        if (!contraseña) {
            throw new ServerError("La contraseña no es válida.", 400)
        }

        const hashedPassword = await bcrypt.hash(contraseña, 10)

        const nuevoUsuario = new USUARIO({
            nombre,
            email,
            contraseña: hashedPassword,
        })

        await nuevoUsuario.save()

        const usuarioGuardado = nuevoUsuario.toObject()
        delete usuarioGuardado.contraseña

        return response.status(201).json({
            message: "Usuario creado y guardado en la base de datos con éxito.",
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
