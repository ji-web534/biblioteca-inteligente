import LIBRO from "../esquemas/esquema_libro.js";
import autenticacion from "../midleware/autenticacion.js";
import validarCampos from "../midleware/validar_campos.js";
import { Router } from "express";

const router = Router();

router.post("/", autenticacion, validarCampos({
    body: {
        nombre: { requerido: true, tipo: "string", max: 50, sanitizar: "trim", mensaje: "El nombre no es válido." },
        descripcion: { requerido: true, tipo: "string", max: 150, sanitizar: "trim", mensaje: "La descripción no es válida." },
        genero: { tipo: "string", max: 15, sanitizar: ["trim", "lowercase"], mensaje: "La categoría no es válida." },
        contenido: { tipo: "string", max: 500000, mensaje: "El texto del libro es demasiado largo." }
    }
}), async (request, response, next) => {
    try {
        const { descripcion, nombre, genero, contenido } = request.body;

        const nuevoLibro = new LIBRO({
            nombre,
            descripcion,
            genero: genero?.trim() || "",
            contenido: contenido || "",
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