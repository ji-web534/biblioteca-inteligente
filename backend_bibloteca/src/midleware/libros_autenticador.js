import LIBRO from "../esquemas/esquema_libro.js"
import ServerError from "../helpers/error_class.js"

async function libros_autenticador(request, response, next) {
    try {
        const { nombre } = request.body

        if (!nombre) {
            throw new ServerError("El nombre del libro es obligatorio.", 400)
        }

        const libroencontrado = await LIBRO.findOne({ nombre })

        if (!libroencontrado) {
            throw new ServerError("Libro no encontrado.", 404)
        }

        response.locals.libro = libroencontrado
        return next()
    } catch (error) {
        return next(error)
    }
}

export default libros_autenticador
