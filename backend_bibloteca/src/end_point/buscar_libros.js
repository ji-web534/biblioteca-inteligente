import LIBRO from "../esquemas/esquema_libro.js"
import { Router } from "express"
import validarCampos from "../midleware/validar_campos.js"

const router = Router()

router.get("/buscar", validarCampos({
    query: { q: { tipo: "string", max: 100, sanitizar: ["trim", "escaparRegex"], mensaje: "Búsqueda demasiado larga." } }
}), async (request, response, next) => {
    try {
        const { q } = request.query
        if (!q) {
            return response.json({ ok: true, data: [] })
        }

        const regex = new RegExp(q, "i")

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