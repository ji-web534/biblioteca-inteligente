
import { Router } from "express"; 

const router = Router();
router.get("/app/bibilo/:id", (request, response, next) => {
    try {
      
        const idUsuario = parseInt(request.params.id);

        const buscador = libros.find((libro) => {
            return libro.id === idUsuario;
        });

        
        if (buscador) {
            
            response.json(buscador);
        } else {
   
            response.status(404).send("El libro no existe");
        }

    } catch (error) {
        next(error)
    }
});
export default router;