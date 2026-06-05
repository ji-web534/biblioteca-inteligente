import { libros } from "../lista.js";
import { Router } from "express";

const router = Router();
router.get("/app/bibilo/autor/:autor", (request, response) => {
    try {
      
        const autor = request.params.autor;

        const buscadorAutor = libros.find((libro) => {
          return libro.autor.toLowerCase() === autorBuscado.toLowerCase();
        });

        
        if (buscadorAutor) {
            
            response.json(buscadorAutor);
        } else {
   
            response.status(404).send("El autor no existe");
        }

    } catch (error) {
      
        console.error(error);
        response.status(500).send("Ocurrió un error interno en el servidor");
    }
});
export default router;