import LIBRO from "../esquemas/esquema_libro.js"
import { Router } from "express"

const router = Router()
router.get("/:autor", async (request, response, next) => {
    try {
        const autor = request.params.autor
        const buscadorAutor = await LIBRO.find({
            autor: { $regex: new RegExp(autor, "i") }
        })

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