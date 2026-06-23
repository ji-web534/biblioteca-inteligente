import LIBRO from "../esquemas/esquema_libro.js"
import { Router } from "express"

const router = Router()

router.get("/buscar", async (request, response, next) => {
    try {
        const { q } = request.query
        if (!q || q.trim() === "") {
            return response.json({ ok: true, data: [] })
        }

        const termino = q.trim()
        const regex = new RegExp(termino, "i")

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