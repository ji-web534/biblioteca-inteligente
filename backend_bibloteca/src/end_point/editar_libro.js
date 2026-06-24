import LIBRO from "../esquemas/esquema_libro.js"
import autenticacion from "../midleware/autenticacion.js"
import ServerError from "../helpers/error_class.js"
import { Router } from "express"

const router = Router()

router.put("/:id", autenticacion, async (request, response, next) => {
    try {
        const { id } = request.params
        const { nombre, descripcion, autor, genero } = request.body

        if (!nombre || nombre.trim() === "") {
            throw new ServerError("El nombre del libro es obligatorio.", 400)
        }
        if (!descripcion || descripcion.trim() === "") {
            throw new ServerError("La descripción es obligatoria.", 400)
        }

        const libro = await LIBRO.findById(id)

        if (!libro) {
            throw new ServerError("Libro no encontrado.", 404)
        }

        if (libro.usuarioId?.toString() !== request.usuarioId) {
            throw new ServerError("No tiene permiso para editar este libro.", 403)
        }

        libro.nombre = nombre.trim()
        libro.descripcion = descripcion.trim()
        libro.autor = autor?.trim() || ""
        libro.genero = genero?.trim() || ""

        await libro.save()

        return response.json({ ok: true, data: libro })
    } catch (error) {
        return next(error)
    }
})

export default router