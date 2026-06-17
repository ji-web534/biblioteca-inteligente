
import { Router } from "express";

const router = Router();
router.get("/app/bibilo/autor/:autor", (request, response, next) => {
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
        next(error)
    }
});
export default router;