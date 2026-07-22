import USUARIO from "../esquemas/esquema_usuario.js";
import ServerError from "../helpers/error_class.js";
import { Router } from "express";
import validarCampos from "../midleware/validar_campos.js";

const router = Router();

router.post("/", validarCampos({
    body: { idUsuario: { requerido: true, tipo: "objectId" } }
}), async (request, response, next) => {
    try {
        const { idUsuario } = request.body;

        const usuarioActualizado = await USUARIO.findByIdAndUpdate(
            idUsuario,
            { $set: { confirm: true } },
            { new: true }
        );

        if (!usuarioActualizado) {
            throw new ServerError("No se encontró el usuario.", 404);
        }

        return response.status(201).json({
            message: "Usuario verificado con éxito.",
            data: usuarioActualizado
        });

    } catch (error) {
        return next(error);
    }
});

export default router
