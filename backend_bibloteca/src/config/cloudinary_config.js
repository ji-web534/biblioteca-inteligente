import { v2 as cloudinary } from "cloudinary"
import multer from "multer"

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp"]
const MAX_BYTES = 5 * 1024 * 1024

// Validación real en el servidor: tipo MIME y tamaño máximo.
// El frontend puede validar para UX, pero aquí NO se confía en él.
const almacenamiento = multer.memoryStorage()

export const aceptarImagen = multer({
    storage: almacenamiento,
    limits: { fileSize: MAX_BYTES, files: 1 },
    fileFilter: (_solicitud, archivo, callback) => {
        if (!TIPOS_PERMITIDOS.includes(archivo.mimetype)) {
            return callback(new Error("Formato no permitido. Use JPG, PNG o WebP."))
        }
        return callback(null, true)
    }
})

// Envuelve el archivo recibido en memoria y lo sube firmado a Cloudinary.
export function subirBufferCloudinary(buffer) {
    return new Promise((resolver, rechazar) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "biblo/portadas",
                resource_type: "image",
                transformation: [{ width: 800, crop: "limit" }]
            },
            (error, resultado) => {
                if (error || !resultado) {
                    return rechazar(new Error(error?.message || "Error al subir la imagen a Cloudinary."))
                }
                return resolver(resultado)
            }
        )
        return stream.end(buffer)
    })
}

export function manejarErroresImagen(solicitud, respuesta, siguiente) {
    aceptarImagen.single("imagen")(solicitud, respuesta, (error) => {
        if (error) {
            const mensaje = error.code === "LIMIT_FILE_SIZE"
                ? "La imagen supera los 5MB."
                : error.message
            return respuesta.status(400).json({ message: mensaje })
        }
        return siguiente()
    })
}

export default cloudinary