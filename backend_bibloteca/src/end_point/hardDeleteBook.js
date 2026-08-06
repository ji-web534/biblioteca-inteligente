import LIBRO from "../esquemas/esquema_libro.js"
import autenticacion from "../midleware/autenticacion.js"
import { tienePermiso } from "../midleware/autorizacion.js"
import validarCampos from "../midleware/validar_campos.js"
import ServerError from "../helpers/error_class.js"
import { Router } from "express"

const router = Router()

router.delete("/:id/hard", autenticacion, validarCampos({
    params: { id: { requerido: true, tipo: "objectId" } }
}), tienePermiso("can_delete_books"), async (request, response, next) => {
    try {
        const { id } = request.params

        const libro = await LIBRO.findById(id)

        if (!libro) {
            throw new ServerError("Libro no encontrado.", 404)
        }

        await LIBRO.deleteOne({ _id: id })

        return response.json({ ok: true, message: "Libro eliminado permanentemente." })
    } catch (error) {
        return next(error)
    }
})

export default router