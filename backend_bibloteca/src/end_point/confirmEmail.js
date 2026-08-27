import USUARIO from "../esquemas/esquema_usuario.js";
import ServerError from "../helpers/error_class.js";
import verificarJWT from "../helpers/verificar_jwt.js";
import { Router } from "express";
import validarCampos from "../midleware/validar_campos.js";

const router = Router();

router.post("/", validarCampos({
    body: { token: { requerido: true, tipo: "string", mensaje: "Token de verificación requerido." } }
}), async (request, response, next) => {
    try {
        const { token } = request.body;
        const decoded = verificarJWT(token);

        if (!decoded.email) {
            throw new ServerError("Token inválido.", 401);
        }

        const usuarioActualizado = await USUARIO.findOneAndUpdate(
            { email: decoded.email },
            { $set: { confirm: true } },
            { new: true }
        ).select("-contraseña");

        if (!usuarioActualizado) {
            throw new ServerError("No se encontró un usuario con ese email.", 404);
        }

        return response.status(201).json({
            message: "Usuario verificado con éxito.",
            data: {
                id: usuarioActualizado._id,
                email: usuarioActualizado.email
            }
        });

    } catch (error) {
        return next(error);
    }
});

export default router
