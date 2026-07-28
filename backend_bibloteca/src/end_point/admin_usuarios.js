import USUARIO from "../esquemas/esquema_usuario.js"
import ServerError from "../helpers/error_class.js"
import { Router } from "express"
import { autorizacion } from "../midleware/autorizacion.js"
import validarCampos from "../midleware/validar_campos.js"

const router = Router()

router.get("/", autorizacion("admin"), async (request, response, next) => {
    try {
        const usuarios = await USUARIO.find().select("-contraseña")
        return response.json({ ok: true, data: usuarios })
    } catch (error) {
        return next(error)
    }
})

router.put("/:id/role", autorizacion("admin"), validarCampos({
    params: { id: { requerido: true, tipo: "objectId" } },
    body: { role: { requerido: true, tipo: "string", mensaje: "El rol es obligatorio." } }
}), async (request, response, next) => {
    try {
        const { id } = request.params
        const { role } = request.body

        const usuario = await USUARIO.findById(id)
        if (!usuario) {
            throw new ServerError("Usuario no encontrado.", 404)
        }

        usuario.role = role
        await usuario.save()

        return response.json({ ok: true, message: `Rol actualizado a "${role}".`, data: usuario })
    } catch (error) {
        return next(error)
    }
})

router.put("/:id/permisos", autorizacion("admin"), validarCampos({
    params: { id: { requerido: true, tipo: "objectId" } },
    body: { permisos: { requerido: true, tipo: "object", mensaje: "Los permisos son obligatorios." } }
}), async (request, response, next) => {
    try {
        const { id } = request.params
        const { permisos } = request.body

        const usuario = await USUARIO.findById(id)
        if (!usuario) {
            throw new ServerError("Usuario no encontrado.", 404)
        }

        usuario.permisos = permisos
        await usuario.save()

        return response.json({ ok: true, message: "Permisos actualizados.", data: usuario })
    } catch (error) {
        return next(error)
    }
})

export default router
