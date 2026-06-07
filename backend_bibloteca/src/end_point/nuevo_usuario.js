    import USUARIO from "../esquemas/esquema_usuario.js"; // 1. Agregado el .js
import ServerError from "../helpers/error_class.js"; // 2. IMPORTANTE: Importar tu clase de 
import { Router } from "express";
import bcrypt from "bcrypt";
const router = Router();


router.post("/", async (request, response, next) => {
    try {
      
        const { email, contraseña, nombre } = request.body; 
        
        if (!email) {
            throw new ServerError("El email no es válido.", 400);
        }
        
        if (!contraseña) {
            throw new ServerError("La contraseña no es válida.", 400);
        }
          // aca se debe hashear la contraseña
        const hashedPassword = await bcrypt.hash(contraseña, 10);
        const nuevoUsuario = new USUARIO({
            email: email,
            hashedPassword: hashedPassword,
            nombre: nombre
        });
        
        await nuevoUsuario.save();
        
        return response.status(201).json({
            message: "Usuario creado y guardado en la base de datos con éxito.",
            data: nuevoUsuario
        });
        
    } catch (error) {
       
        return next(error);
    }
});
export default router;