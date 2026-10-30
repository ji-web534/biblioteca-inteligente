import { Router } from "express"
import autenticacion from "../midleware/autenticacion.js"
import { manejarErroresImagen, subirBufferCloudinary } from "../config/cloudinary_config.js"

const router = Router()

router.post("/", autenticacion, manejarErroresImagen, async (solicitud, respuesta, siguiente) => {
    try {
        if (!solicitud.file) {
            return respuesta.status(400).json({ message: "No se recibió ninguna imagen." })
        }

        const resultado = await subirBufferCloudinary(solicitud.file.buffer)

        return respuesta.status(201).json({
            message: "Imagen subida correctamente.",
            data: {
                url: resultado.secure_url,
                publicId: resultado.public_id
            }
        })

    } catch (error) {
        return siguiente(error)
    }
})

export default router