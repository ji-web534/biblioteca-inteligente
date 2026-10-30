import LIBRO from "../esquemas/esquema_libro.js"
import autenticacion from "../midleware/autenticacion.js"
import { tienePermiso } from "../midleware/autorizacion.js"
import validarCampos from "../midleware/validar_campos.js"
import ServerError from "../helpers/error_class.js"
import { Router } from "express"

const router = Router()

router.get("/", autenticacion, tienePermiso("can_delete_books"), validarCampos({
    query: {
        page: { tipo: "number", min: 1, mensaje: "La página debe ser mayor a 0." },
        limit: { tipo: "number", min: 1, max: 50, mensaje: "El límite debe estar entre 1 y 50." }
    }
}), async (request, response, next) => {
    try {
        const { eliminados } = request.query
        const page = Math.max(1, parseInt(request.query.page) || 1)
        const limit = Math.min(50, Math.max(1, parseInt(request.query.limit) || 20))
        const skip = (page - 1) * limit
        const filtro = {}

        if (eliminados === "true") {
            filtro.activo = false
        } else if (eliminados !== "false" && eliminados !== undefined) {
            filtro.activo = true
        }

        const [libros, total] = await Promise.all([
            LIBRO.find(filtro).sort({ createdAt: -1 }).skip(skip).limit(limit),
            LIBRO.countDocuments(filtro)
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

router.put("/:id/restore", autenticacion, validarCampos({
    params: { id: { requerido: true, tipo: "objectId" } }
}), tienePermiso("can_delete_books"), async (request, response, next) => {
    try {
        const { id } = request.params

        const libro = await LIBRO.findById(id)

        if (!libro) {
            throw new ServerError("Libro no encontrado.", 404)
        }

        if (libro.activo) {
            throw new ServerError("El libro ya está activo.", 400)
        }

        libro.activo = true
        await libro.save()

        return response.json({ ok: true, message: "Libro restaurado correctamente." })
    } catch (error) {
        return next(error)
    }
})

export default router
