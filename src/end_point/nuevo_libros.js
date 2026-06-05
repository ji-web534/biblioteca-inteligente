import LIBRO from "../esquemas/esquema_libro.js"; // 1. Agregado el .js
import ServerError from "../helpers/error_class.js"; // 2. IMPORTANTE: Importar tu clase de errores
import { Router } from "express";

const router = Router();

// 3. CORREGIDO: Agregamos 'async' antes de los parámetros, y sumamos 'next'
router.post("/", async (request, response, next) => {
    try {
        // 4. CORREGIDO: Cambiada la coma del final por un punto y coma (;)
        const { descripcion, nombre } = request.body; 
        
        if (!descripcion) {
            throw new ServerError("La descripción no es válida.", 400);
        }
        
        if (!nombre) {
            throw new ServerError("El nombre no es válido.", 400);
        }
        
        const nuevoLibro = new LIBRO({
            nombre: nombre,
            descripcion: descripcion
        });
        
        // Ahora el await funciona perfectamente gracias al async de arriba
        await nuevoLibro.save();

        return response.status(201).json({
            message: "Libro creado y guardado en la base de datos con éxito.",
            data: nuevoLibro
        });
        
    } catch (error) {
        // Ahora Express sabe qué es 'next' porque lo declaramos en los parámetros
        return next(error);
    }
});

export default router;