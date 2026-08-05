import LIBRO from "../esquemas/esquema_libro.js"
import { Router } from "express"
import validarCampos from "../midleware/validar_campos.js"

const router = Router()

router.get("/buscar", validarCampos({
    query: {
        q: { tipo: "string", max: 100, sanitizar: ["trim", "escaparRegex"], mensaje: "Búsqueda demasiado larga." },
        page: { tipo: "number", min: 1, mensaje: "La página debe ser mayor a 0." },
        limit: { tipo: "number", min: 1, max: 50, mensaje: "El límite debe estar entre 1 y 50." }
    }
}), async (request, response, next) => {
    try {
        const { q } = request.query
        const page = Math.max(1, parseInt(request.query.page) || 1)
        const limit = Math.min(50, Math.max(1, parseInt(request.query.limit) || 20))
        const skip = (page - 1) * limit

        if (!q) {
            const total = await LIBRO.countDocuments({ activo: true })
            return response.json({
                ok: true,
                data: [],
                pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 }
            })
        }

        const regex = new RegExp(q, "i")

        const [libros, total] = await Promise.all([
            LIBRO.find({
                $or: [
                    { nombre: regex },
                    { descripcion: regex },
                    { autor: regex },
                    { genero: regex }
                ],
                activo: true
            }).sort({ _id: -1 }).skip(skip).limit(limit),
            LIBRO.countDocuments({
                $or: [
                    { nombre: regex },
                    { descripcion: regex },
                    { autor: regex },
                    { genero: regex }
                ],
                activo: true
            })
        ])

        response.json({
            ok: true,
            data: libros,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 }
        })
    } catch (error) {
        next(error)
    }
})

export default router