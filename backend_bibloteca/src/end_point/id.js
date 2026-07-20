import mongoose from "mongoose"
import LIBRO from "../esquemas/esquema_libro.js"
import { Router } from "express"

const router = Router()
router.get("/:id", async (request, response, next) => {
    try {
        const idUsuario = request.params.id

        if (!mongoose.Types.ObjectId.isValid(idUsuario)) {
            return response.status(400).json({ message: "ID inválido." })
        }

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