import LIBRO from "../esquemas/esquema_libro.js";
import ServerError from "../helpers/error_class.js";
import autenticacion from "../midleware/autenticacion.js";
import { Router } from "express";

const router = Router();

router.post("/", autenticacion, async (request, response, next) => {
    try {
        const { descripcion, nombre } = request.body; 
        
        if (!descripcion) {
            throw new ServerError("La descripción no es válida.", 400);
        }
        
        if (!nombre) {
            throw new ServerError("El nombre no es válido.", 400);
        }
        
        const nuevoLibro = new LIBRO({
            nombre: nombre,
            descripcion: descripcion,
            usuarioId: request.usuarioId
        });
        
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