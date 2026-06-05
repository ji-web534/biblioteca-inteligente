import LIBRO from "../esquemas/esquema_libro.js"; // 1. Agregado el .js
import ServerError from "../helpers/error_class.js"; // 2. IMPORTANTE: Importar tu clase de errores
import { Router } from "express";

const router = Router();


router.post("/",   libros_autenticador ,async (request, response,) => {
    try {
      
        const {  nombre } = request.body; 
       // uso esta variable heredada midleware 
      const libroencontrado = response.locals.libro;
        
        const nuevoLibro = new LIBRO({
            nombre: nombre,
            descripcion: descripcion
        });
        
     response .json(  libroencontrado)
  

     
        
    } catch (error) {
        
        return next(error);
    }
});

export default router;