import LIBRO from "../esquemas/esquema_libro.js"
import autenticacion from "../midleware/autenticacion.js"
import { Router } from "express"

const router = Router()

router.get("/", autenticacion, async (request, response, next) => {
    try {
        const libros = await LIBRO.find({ usuarioId: request.usuarioId }).sort({ _id: -1 })
        return response.json({ ok: true, data: libros })
    } catch (error) {
        return next(error)
    }
})

export default router
