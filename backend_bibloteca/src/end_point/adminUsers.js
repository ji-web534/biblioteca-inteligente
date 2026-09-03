import USUARIO from "../esquemas/esquema_usuario.js"
import ServerError from "../helpers/error_class.js"
import { Router } from "express"
import autenticacion from "../midleware/autenticacion.js"
import { autorizacion } from "../midleware/autorizacion.js"
import validarCampos from "../midleware/validar_campos.js"

const router = Router()

const ROLES_VALIDOS = ["user", "moderator", "admin"]

const PERMISOS_VALIDOS = [
    "can_delete_books",
    "can_suspend_users",
    "can_edit_others_books",
    "can_manage_categories",
    "can_manage_users"
]

router.get("/", autenticacion, autorizacion("admin"), async (request, response, next) => {
    try {
        const usuarios = await USUARIO.find().select("-contraseña")
        return response.json({ ok: true, data: usuarios })
    } catch (error) {
        return next(error)
    }
})

router.put("/:id/role", autenticacion, autorizacion("admin"), validarCampos({
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

        if (!ROLES_VALIDOS.includes(role)) {
            throw new ServerError("Rol no válido.", 400)
        }

        usuario.role = role
        await usuario.save()

        return response.json({ ok: true, message: `Rol actualizado a "${role}".`, data: { ...usuario.toObject(), contraseña: undefined } })
    } catch (error) {
        return next(error)
    }
})

router.put("/:id/permisos", autenticacion, autorizacion("admin"), validarCampos({
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

        const permisosLimpios = {}
        PERMISOS_VALIDOS.forEach((campo) => {
            permisosLimpios[campo] = typeof permisos[campo] === "boolean" ? permisos[campo] : false
        })

        usuario.permisos = permisosLimpios
        await usuario.save()

        return response.json({ ok: true, message: "Permisos actualizados.", data: usuario })
    } catch (error) {
        return next(error)
    }
})

export default router
