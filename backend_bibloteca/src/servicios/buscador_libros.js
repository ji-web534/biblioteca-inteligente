import { Router } from "express"
import libros_autenticador from "../middlewares/libros_autenticador.js"

const router = Router()

router.post("/", libros_autenticador, async (request, response, next) => {
    try {
        const libroencontrado = response.locals.libro
        return response.json(libroencontrado)
    } catch (error) {
        return next(error)
    }
})

export default router
