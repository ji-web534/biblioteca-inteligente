import LIBRO from "../esquemas/esquema_libro.js";
import ServerError from "../helpers/error_class";

async function libros_autenticador(request, response, next) {
    try {
        const { nombre }=request.body
        if (!nombre) {
           throw new ServerError("El nombre del libro es obligatorio.", 400)}
          
const libroencontrado = await LIBRO.findOne({ nombre: nombre });
        if (!libroencontrado) {
           throw new ServerError("libro no encontrado.", 400)}
           response.locals.libro = libroencontrado;
        return next()
    }
    catch (error) {
      return next(error);

    }
}

export default libros_autenticador