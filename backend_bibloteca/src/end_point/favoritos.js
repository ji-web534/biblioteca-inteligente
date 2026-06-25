import USUARIO from "../esquemas/esquema_usuario.js"
import LIBRO from "../esquemas/esquema_libro.js"
import autenticacion from "../midleware/autenticacion.js"
import ServerError from "../helpers/error_class.js"
import { Router } from "express"

const router = Router()

router.post("/:libroId", autenticacion, async (request, response, next) => {
    try {
        const { libroId } = request.params

        const libro = await LIBRO.findById(libroId)
        if (!libro) {
            throw new ServerError("Libro no encontrado.", 404)
        }

        const usuario = await USUARIO.findById(request.usuarioId)
        if (!usuario) {
            throw new ServerError("Usuario no encontrado.", 404)
        }

        if (usuario.favoritos?.includes(libroId)) {
            return response.json({ ok: true, message: "El libro ya está en favoritos." })
        }

        usuario.favoritos = usuario.favoritos || []
        usuario.favoritos.push(libroId)
        await usuario.save()

        return response.json({ ok: true, message: "Libro agregado a favoritos." })
    } catch (error) {
        return next(error)
    }
})

router.delete("/:libroId", autenticacion, async (request, response, next) => {
    try {
        const { libroId } = request.params

        const usuario = await USUARIO.findById(request.usuarioId)
        if (!usuario) {
            throw new ServerError("Usuario no encontrado.", 404)
        }

        usuario.favoritos = (usuario.favoritos || []).filter(
            (id) => id.toString() !== libroId
        )
        await usuario.save()

        return response.json({ ok: true, message: "Libro eliminado de favoritos." })
    } catch (error) {
        return next(error)
    }
})

router.get("/", autenticacion, async (request, response, next) => {
    try {
        const usuario = await USUARIO.findById(request.usuarioId).populate("favoritos")

        if (!usuario) {
            return response.json({ ok: true, data: [] })
        }

        return response.json({ ok: true, data: usuario.favoritos || [] })
    } catch (error) {
        return next(error)
    }
})

export default router
