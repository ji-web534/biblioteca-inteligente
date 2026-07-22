import LIBRO from "../esquemas/esquema_libro.js"
import autenticacion from "../midleware/autenticacion.js"
import validarCampos from "../midleware/validar_campos.js"
import ServerError from "../helpers/error_class.js"
import { Router } from "express"

const router = Router()

router.put("/:id", autenticacion, validarCampos({
    params: { id: { requerido: true, tipo: "objectId" } },
    body: {
        nombre: { requerido: true, tipo: "string", sanitizar: "trim", mensaje: "El nombre del libro es obligatorio." },
        descripcion: { requerido: true, tipo: "string", sanitizar: "trim", mensaje: "La descripción es obligatoria." }
    }
}), async (request, response, next) => {
    try {
        const { id } = request.params
        const { nombre, descripcion, autor, genero } = request.body

        const libro = await LIBRO.findById(id)

        if (!libro) {
            throw new ServerError("Libro no encontrado.", 404)
        }

        if (libro.usuarioId?.toString() !== request.usuarioId) {
            throw new ServerError("No tiene permiso para editar este libro.", 403)
        }

        libro.nombre = nombre
        libro.descripcion = descripcion
        libro.autor = autor?.trim() || ""
        libro.genero = genero?.trim() || ""

        await libro.save()

        return response.json({ ok: true, data: libro })
    } catch (error) {
        return next(error)
    }
})

export default router