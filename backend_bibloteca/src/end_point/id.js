import LIBRO from "../esquemas/esquema_libro.js"
import { Router } from "express"

const router = Router()
router.get("/:id", async (request, response, next) => {
    try {
        const idUsuario = request.params.id

        const buscador = await LIBRO.findById(idUsuario)

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