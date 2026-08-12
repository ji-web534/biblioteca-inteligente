import LIBRO from "../esquemas/esquema_libro.js";
import autenticacion from "../midleware/autenticacion.js";
import validarCampos from "../midleware/validar_campos.js";
import { Router } from "express";

const router = Router();

router.post("/", autenticacion, validarCampos({
    body: {
        nombre: { requerido: true, tipo: "string", max: 50, sanitizar: "trim", mensaje: "El nombre no es válido." },
        descripcion: { requerido: true, tipo: "string", min: 1, max: 50, sanitizar: "trim", mensaje: "La descripción no es válida (máx. 50)." },
        texto: { requerido: true, tipo: "string", min: 1, max: 150, sanitizar: "trim", mensaje: "El texto no es válido (máx. 150)." },
        genero: { tipo: "string", max: 15, sanitizar: ["trim", "lowercase"], mensaje: "La categoría no es válida." }
    }
}), async (request, response, next) => {
    try {
        const { descripcion, nombre, texto, genero } = request.body;

        const nuevoLibro = new LIBRO({
            nombre,
            descripcion,
            texto: texto || "",
            genero: genero?.trim() || "",
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