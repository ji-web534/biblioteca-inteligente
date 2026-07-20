import LIBRO from "../esquemas/esquema_libro.js"
import { escaparRegex } from "../helpers/regex_utils.js"
import { Router } from "express"

const router = Router()
router.get("/:autor", async (request, response, next) => {
    try {
        const autor = request.params.autor

        if (!autor || autor.trim().length === 0 || autor.length > 100) {
            return response.status(400).json({ message: "Autor inválido." })
        }

        const regex = new RegExp(escaparRegex(autor.trim()), "i")
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