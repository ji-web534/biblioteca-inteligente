import USUARIO from "../esquemas/esquema_usuario.js"
import ServerError from "../helpers/error_class.js"
import { Router } from "express"
import bcrypt from "bcrypt"
import enviarEmailConfirmacion from "../helpers/email_confirmacion.js";



const router = Router()

router.post("/", async (request, response, next) => {
    try {
        const { email, contraseña, nombre } = request.body

    
        if (!nombre || !nombre.trim()) {
            throw new ServerError("El nombre no es válido.", 400)
        }

        if (!email || !email.trim()) {
            throw new ServerError("El email no es válido.", 400)
        }

        if (!contraseña) {
            throw new ServerError("La contraseña no es válida.", 400)
        }

      
        if (contraseña.length < 6) {
            throw new ServerError("La contraseña debe tener al menos 6 caracteres.", 400)
        }

    
        const hashedPassword = await bcrypt.hash(contraseña, 10)

     
        const nuevoUsuario = new USUARIO({
            nombre: nombre.trim(),
            email: email.toLowerCase().trim(),
            contraseña: hashedPassword,
        })

     
        await nuevoUsuario.save()


        try {
            await enviarEmailConfirmacion(nuevoUsuario.nombre, nuevoUsuario.email)
        } catch (mailError) {
          
            console.error("Error al enviar el mail de confirmación:", mailError)
        }

     
        const usuarioGuardado = nuevoUsuario.toObject()
        delete usuarioGuardado.contraseña

       
        return response.status(201).json({
            ok: true,
            message: "Usuario creado y guardado con éxito. Por favor, verifica tu correo electrónico.",
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
