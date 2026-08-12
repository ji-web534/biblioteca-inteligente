import LIBRO from "../esquemas/esquema_libro.js"
import { Router } from "express"
import validarCampos from "../midleware/validar_campos.js"

const router = Router()

router.get("/buscar", validarCampos({
    query: {
        q: { tipo: "string", max: 100, sanitizar: ["trim", "escaparRegex"], mensaje: "Búsqueda demasiado larga." },
        genero: { tipo: "string", max: 15, sanitizar: ["trim", "escaparRegex"], mensaje: "Género inválido." },
        autor: { tipo: "string", max: 100, sanitizar: ["trim", "escaparRegex"], mensaje: "Autor inválido." },
        desde: { tipo: "string", max: 30, mensaje: "Fecha inválida." },
        hasta: { tipo: "string", max: 30, mensaje: "Fecha inválida." },
        page: { tipo: "number", min: 1, mensaje: "La página debe ser mayor a 0." },
        limit: { tipo: "number", min: 1, max: 50, mensaje: "El límite debe estar entre 1 y 50." }
    }
}), async (request, response, next) => {
    try {
        const { q, genero, autor, desde, hasta } = request.query
        const page = Math.max(1, parseInt(request.query.page) || 1)
        const limit = Math.min(50, Math.max(1, parseInt(request.query.limit) || 20))
        const skip = (page - 1) * limit

        const filtro = { activo: true }

        const condiciones = []
        if (q) {
            const regex = new RegExp(q, "i")
            condiciones.push(
                { nombre: regex },
                { descripcion: regex },
                { texto: regex },
                { autor: regex },
                { genero: regex }
            )
        }

        if (genero) {
            filtro.genero = new RegExp(genero, "i")
        }

        if (autor) {
            filtro.autor = new RegExp(autor, "i")
        }

        if (desde || hasta) {
            filtro.createdAt = {}
            if (desde) filtro.createdAt.$gte = new Date(desde)
            if (hasta) filtro.createdAt.$lte = new Date(hasta)
        }

        if (condiciones.length > 0) {
            filtro.$or = condiciones
        }

        if (!q && !genero && !autor && !desde && !hasta) {
            const total = await LIBRO.countDocuments({ activo: true })
            return response.json({
                ok: true,
                data: [],
                pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 }
            })
        }

        const [libros, total] = await Promise.all([
            LIBRO.find(filtro).sort({ createdAt: -1 }).skip(skip).limit(limit),
            LIBRO.countDocuments(filtro)
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