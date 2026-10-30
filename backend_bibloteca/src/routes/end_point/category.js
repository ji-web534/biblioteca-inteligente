import CATEGORIA from "../esquemas/esquema_categoria.js"
import autenticacion from "../midleware/autenticacion.js"
import { tienePermiso } from "../midleware/autorizacion.js"
import validarCampos from "../midleware/validar_campos.js"
import ServerError from "../helpers/error_class.js"
import { Router } from "express"

const router = Router()

router.get("/", async (request, response, next) => {
    try {
        const categoriaListado = await CATEGORIA.find().sort({ nombre: 1 })
        return response.json({ ok: true, data: categoriaListado })
    } catch (error) {
        return next(error)
    }
})

router.post("/", autenticacion, tienePermiso("can_manage_categories"), validarCampos({
    body: {
        nombre: { requerido: true, tipo: "string", min: 1, max: 50, sanitizar: ["trim", "lowercase"], mensaje: "El nombre de la categoría no es válido." },
        descripcion: { tipo: "string", max: 200, sanitizar: "trim", mensaje: "La descripción es demasiado larga." }
    }
}), async (request, response, next) => {
    try {
        const { nombre, descripcion } = request.body

        const nuevaCategoria = new CATEGORIA({
            nombre,
            descripcion: descripcion?.trim() || ""
        })

        await nuevaCategoria.save()

        return response.status(201).json({
            ok: true,
            message: "Categoría creada con éxito.",
            data: nuevaCategoria
        })
    } catch (error) {
        if (error.code === 11000) {
            return next(new ServerError("Esa categoría ya existe.", 400))
        }
        return next(error)
    }
})

router.put("/:id", autenticacion, tienePermiso("can_manage_categories"), validarCampos({
    params: { id: { requerido: true, tipo: "objectId" } },
    body: {
        nombre: { tipo: "string", min: 1, max: 50, sanitizar: ["trim", "lowercase"], mensaje: "El nombre de la categoría no es válido." },
        descripcion: { tipo: "string", max: 200, sanitizar: "trim", mensaje: "La descripción es demasiado larga." },
        activo: { tipo: "string", mensaje: "El estado no es válido." }
    }
}), async (request, response, next) => {
    try {
        const { id } = request.params
        const categoria = await CATEGORIA.findById(id)

        if (!categoria) {
            throw new ServerError("Categoría no encontrada.", 404)
        }

        if (request.body.nombre !== undefined) categoria.nombre = request.body.nombre
        if (request.body.descripcion !== undefined) categoria.descripcion = request.body.descripcion?.trim() || ""
        if (request.body.activo !== undefined) categoria.activo = request.body.activo === "true"

        await categoria.save()

        return response.json({ ok: true, message: "Categoría actualizada con éxito.", data: categoria })
    } catch (error) {
        if (error.code === 11000) {
            return next(new ServerError("Esa categoría ya existe.", 400))
        }
        return next(error)
    }
})

router.delete("/:id", autenticacion, tienePermiso("can_manage_categories"), validarCampos({
    params: { id: { requerido: true, tipo: "objectId" } }
}), async (request, response, next) => {
    try {
        const { id } = request.params
        const categoria = await CATEGORIA.findById(id)

        if (!categoria) {
            throw new ServerError("Categoría no encontrada.", 404)
        }

        categoria.activo = false
        await categoria.save()

        return response.json({ ok: true, message: "Categoría desactivada con éxito.", data: categoria })
    } catch (error) {
        return next(error)
    }
})

export default router