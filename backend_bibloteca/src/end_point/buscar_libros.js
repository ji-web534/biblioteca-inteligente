import LIBRO from "../esquemas/esquema_libro.js"
import { escaparRegex } from "../helpers/regex_utils.js"
import { Router } from "express"

const router = Router()

router.get("/buscar", async (request, response, next) => {
    try {
        const { q } = request.query
        if (!q || q.trim() === "") {
            return response.json({ ok: true, data: [] })
        }

        const termino = q.trim()
        if (termino.length > 100) {
            return response.status(400).json({ message: "Búsqueda demasiado larga." })
        }

        const regex = new RegExp(escaparRegex(termino), "i")

        const libros = await LIBRO.find({
            $or: [
                { nombre: regex },
                { descripcion: regex },
                { autor: regex },
                { genero: regex }
            ]
        }).sort({ _id: -1 }).limit(50)

        response.json({ ok: true, data: libros })
    } catch (error) {
        next(error)
    }
})

export default router