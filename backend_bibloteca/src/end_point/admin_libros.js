import LIBRO from "../esquemas/esquema_libro.js"
import autenticacion from "../midleware/autenticacion.js"
import { tienePermiso } from "../midleware/autorizacion.js"
import validarCampos from "../midleware/validar_campos.js"
import ServerError from "../helpers/error_class.js"
import { Router } from "express"

const router = Router()

router.get("/", autenticacion, tienePermiso("can_delete_books"), async (request, response, next) => {
    try {
        const { eliminados } = request.query
        const filtro = {}

        if (eliminados === "true") {
            filtro.activo = false
        } else if (eliminados !== "false" && eliminados !== undefined) {
            filtro.activo = true
        }

        const libros = await LIBRO.find(filtro).sort({ createdAt: -1 })
        return response.json({ ok: true, data: libros })
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
