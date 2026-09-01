import USUARIO from "../esquemas/esquema_usuario.js";
import ServerError from "../helpers/error_class.js";
import verificarJWT from "../helpers/verificar_jwt.js";
import { Router } from "express";
import validarCampos from "../midleware/validar_campos.js";

const router = Router();

router.post("/", validarCampos({
    body: { token: { requerido: true, tipo: "string", mensaje: "Token de verificación requerido." } }
), async (request, response, next) => {
    try {
        const { token } = request.body;
        const decoded = verificarJWT(token);

        if (!decoded.email) {
            throw new ServerError("Token inválido.", 401);
        }

        // Buscamos usuario por email del token
        const usuarioActualizado = await USUARIO.findOneAndUpdate(
            { email: decoded.email },
            { $set: { confirm: true } },
            { new: true }
        ).select("-contraseña");

        // Siempre respondemos igual, aunque el usuario no existiera (el token
        // firmado con JWT_SECRET dificulta forzar emails arbitrarios).
        return response.status(201).json({
            message: "Usuario verificado con éxito.",
            data: {
                id: usuarioActualizado?.id || '',
                email: usuarioActualizado?.email || ''
            }
        });

    } catch (error) {
        return next(error);
    }
});

    } catch (error) {
        return next(error);
    }
});

export default router
