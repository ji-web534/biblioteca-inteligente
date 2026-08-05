import LIBRO from "../esquemas/esquema_libro.js"
import autenticacion from "../midleware/autenticacion.js"
import { Router } from "express"

const router = Router()

router.get("/", autenticacion, validarCampos({
    query: {
        page: { tipo: "number", min: 1, mensaje: "La página debe ser mayor a 0." },
        limit: { tipo: "number", min: 1, max: 50, mensaje: "El límite debe estar entre 1 y 50." }
    }
}), async (request, response, next) => {
    try {
        const page = Math.max(1, parseInt(request.query.page) || 1)
        const limit = Math.min(50, Math.max(1, parseInt(request.query.limit) || 20))
        const skip = (page - 1) * limit

        const [libros, total] = await Promise.all([
            LIBRO.find({ usuarioId: request.usuarioId, activo: true })
                .sort({ _id: -1 })
                .skip(skip)
                .limit(limit),
            LIBRO.countDocuments({ usuarioId: request.usuarioId, activo: true })
        ])

        return response.json({
            ok: true,
            data: libros,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 }
        })
    } catch (error) {
        return next(error)
    }
})

export default router
