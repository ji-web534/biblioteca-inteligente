import USUARIO from "../esquemas/esquema_usuario.js"; 
import ServerError from "../helpers/error_class.js"; 
import { Router } from "express";

const router = Router();

router.post("/", async (request, response, next) => {
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
