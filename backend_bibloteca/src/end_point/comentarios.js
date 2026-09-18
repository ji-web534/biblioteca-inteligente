import COMENTARIO from "../esquemas/esquema_comentario.js"
import LIBRO from "../esquemas/esquema_libro.js"
import autenticacion from "../midleware/autenticacion.js"
import validarCampos from "../midleware/validar_campos.js"
import ServerError from "../helpers/error_class.js"
import { Router } from "express"

const router = Router()

router.get("/:libroId", validarCampos({
    params: { libroId: { requerido: true, tipo: "objectId" } }
}), async (request, response, next) => {
    try {
        const { libroId } = request.params

        const comentarios = await COMENTARIO.find({ libroId })
            .sort({ createdAt: -1 })
            .populate("usuarioId", "nombre")

        return response.json({ ok: true, data: comentarios })
    } catch (error) {
        return next(error)
    }
})

router.post("/:libroId", autenticacion, validarCampos({
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