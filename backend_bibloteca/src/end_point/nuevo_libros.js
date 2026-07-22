import LIBRO from "../esquemas/esquema_libro.js";
import autenticacion from "../midleware/autenticacion.js";
import validarCampos from "../midleware/validar_campos.js";
import { Router } from "express";

const router = Router();

router.post("/", autenticacion, validarCampos({
    body: {
        nombre: { requerido: true, tipo: "string", max: 50, sanitizar: "trim", mensaje: "El nombre no es válido." },
        descripcion: { requerido: true, tipo: "string", max: 150, sanitizar: "trim", mensaje: "La descripción no es válida." }
    }
}), async (request, response, next) => {
    try {
        const { descripcion, nombre } = request.body;

        const nuevoLibro = new LIBRO({
            nombre,
            descripcion,
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