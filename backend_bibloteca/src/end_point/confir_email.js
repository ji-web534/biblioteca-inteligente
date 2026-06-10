import LIBRO from "../esquemas/esquema_libro.js"; 
import ServerError from "../helpers/error_class.js"; 


 const confir_email=async (request, response, next) => {
    try {
          // tomamos el id
        const { idUsuario } = request.body;

        // buscamos al usuario con findByIdAndUpdate
        const usuarioActualizado = await USUARIO.findByIdAndUpdate(
            idUsuario,
            { $set: { verificado: true } }, // cambiamos a true
            { new: true } //  lo devuelve
        );
        // si no lo encontro no hay confirmacion
        
        if (!usuarioActualizado) {
            throw new ServerError("No se encontró el usuario.", 404);
        }
        
   
        await nuevoLibro.save();

        return response.status(201).json({
            message: "Libro creado y guardado en la base de datos con éxito.",
            data: nuevoLibro
        });
        
    } catch (error) {
        
        return next(error);
    }
};
export default confir_email
