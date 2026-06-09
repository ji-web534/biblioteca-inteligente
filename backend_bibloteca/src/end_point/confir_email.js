import LIBRO from "../esquemas/esquema_libro.js"; // 1. Agregado el .js
import ServerError from "../helpers/error_class.js"; // 2. IMPORTANTE: Importar tu clase de errores
import { Router } from "express";

const router = Router();


router.post("/", async (request, response, next) => {
    try {
        const { idUsuario } = request.body; // O request.params si viene por URL

        // 🚀 Buscamos por ID y pasamos el campo a true con $set
        const usuarioActualizado = await USUARIO.findByIdAndUpdate(
            idUsuario,
            { $set: { verificado: true } }, // El campo que querés cambiar
            { new: true } // Esto hace que te devuelva el usuario ya modificado
        );

        if (!usuarioActualizado) {
            throw new ServerError("No se encontró el usuario.", 404);
        }
        
   
        await nuevoLibro.save();

        return response.status(201).json({
            message: "Libro creado y guardado en la base de datos con éxito.",
            data: nuevoLibro
        });
        
    } catch (error) {
        
        return next(error);
    }
});

export default router;