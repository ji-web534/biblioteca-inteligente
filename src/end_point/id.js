
import { Router } from "express"; 
import { libros } from "../lista.js";
const router = Router();
router.get("/app/bibilo/:id", (request, response) => {
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
      
        console.error(error);
        response.status(500).send("Ocurrió un error interno en el servidor");
    }
});
export default router;