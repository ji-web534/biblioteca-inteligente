import COMENTARIO from "../esquemas/esquema_comentario.js"
import LIBRO from "../esquemas/esquema_libro.js"
import autenticacion from "../midleware/autenticacion.js"
import validarCampos from "../midleware/validar_campos.js"
import ServerError from "../helpers/error_class.js"
import { Router } from "express"
import { limitarComentarios } from "../midleware/rate_limit.js"

const router = Router()

router.get("/:libroId", validarCampos({
    params: { libroId: { requerido: true, tipo: "objectId" } },
    query: {
        page: { tipo: "number", min: 1, mensaje: "La página debe ser mayor a 0." },
        limit: { tipo: "number", min: 1, max: 50, mensaje: "El límite debe estar entre 1 y 50." }
    }
}), async (request, response, next) => {
    try {
        const { libroId } = request.params

        const libro = await LIBRO.findById(libroId)
        if (!libro) {
            throw new ServerError("Libro no encontrado.", 404)
        }

        if (!libro.activo) {
            throw new ServerError("El libro fue eliminado.", 404)
        }

        const page = Math.max(1, parseInt(request.query.page) || 1)
        const limit = Math.min(50, Math.max(1, parseInt(request.query.limit) || 20))
        const skip = (page - 1) * limit

        const [comentarios, total] = await Promise.all([
            COMENTARIO.find({ libroId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("usuarioId", "nombre"),
            COMENTARIO.countDocuments({ libroId })
        ])

        return response.json({
            ok: true,
            data: comentarios,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 }
        })
    } catch (error) {
        return next(error)
    }
})

router.post("/:libroId", autenticacion, limitarComentarios, validarCampos({
    params: { libroId: { requerido: true, tipo: "objectId" } },
    body: {
        texto: { requerido: true, tipo: "string", min: 1, max: 500, sanitizar: "trim", mensaje: "El comentario no es válido." }
    }
}), async (request, response, next) => {
    try {
        const { libroId } = request.params
        const { texto } = request.body

        const libro = await LIBRO.findById(libroId)
        if (!libro) {
            throw new ServerError("Libro no encontrado.", 404)
        }

        if (!libro.activo) {
            throw new ServerError("El libro fue eliminado.", 404)
        }

        const comentario = new COMENTARIO({
            libroId,
            usuarioId: request.usuarioId,
            texto
        })
        await comentario.save()

        const comentarioConAutor = await COMENTARIO.findById(comentario._id)
            .populate("usuarioId", "nombre")

        return response.status(201).json({
            ok: true,
            message: "Comentario publicado.",
            data: comentarioConAutor
        })
    } catch (error) {
        return next(error)
    }
})

router.delete("/:comentarioId", autenticacion, validarCampos({
    params: { comentarioId: { requerido: true, tipo: "objectId" } }
}), async (request, response, next) => {
    try {
        const { comentarioId } = request.params

        const comentario = await COMENTARIO.findById(comentarioId)
        if (!comentario) {
            throw new ServerError("Comentario no encontrado.", 404)
        }

        const esAdmin = request.usuarioRole === "admin" || request.usuarioRole === "moderator"
        if (comentario.usuarioId.toString() !== request.usuarioId && !esAdmin) {
            throw new ServerError("No tienes permiso para eliminar este comentario.", 403)
        }

        await comentario.deleteOne()

        return response.json({ ok: true, message: "Comentario eliminado." })
    } catch (error) {
        return next(error)
    }
})

export default router