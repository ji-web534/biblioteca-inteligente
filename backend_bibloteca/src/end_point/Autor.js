import LIBRO from "../esquemas/esquema_libro.js"
import { Router } from "express"
import validarCampos from "../midleware/validar_campos.js"

const router = Router()
router.get("/:autor", validarCampos({
    params: { autor: { requerido: true, tipo: "string", min: 1, max: 100, sanitizar: ["trim", "escaparRegex"], mensaje: "Autor inválido." } }
}), async (request, response, next) => {
    try {
        const { autor } = request.params
        const regex = new RegExp(autor, "i")
        const buscadorAutor = await LIBRO.find({ autor: { $regex: regex } })

        if (buscadorAutor.length > 0) {
            response.json(buscadorAutor)
        } else {
            response.status(404).send("El autor no existe")
        }
    } catch (error) {
        next(error)
    }
})
export default router