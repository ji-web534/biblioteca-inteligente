import LIBRO from "../esquemas/esquema_libro.js"
import { Router } from "express"
import validarCampos from "../midleware/validar_campos.js"

const router = Router()
router.get("/:id", validarCampos({
    params: { id: { requerido: true, tipo: "objectId", mensaje: "ID inválido." } }
}), async (request, response, next) => {
    try {
        const { id } = request.params
        const buscador = await LIBRO.findOne({ _id: id, activo: true })

        if (buscador) {
            response.json(buscador)
        } else {
            response.status(404).send("El libro no existe")
        }
    } catch (error) {
        next(error)
    }
})
export default router