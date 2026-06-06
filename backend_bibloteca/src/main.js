import "dotenv/config"
import express from "express"
import nuevo_libros from "./end_point/nuevo_libros.js"
import id from "./end_point/id.js"
import autor from "./end_point/Autor.js"
import ServerError from "./helpers/error_class.js"
import { connectDB } from "./db/connect.js"
import buscador_libros from "./servicios/buscador_libros.js"

const app = express()
const PORT = 8000

app.use(express.json())

app.use((request, response, next) => {
    response.header("Access-Control-Allow-Origin", "http://localhost:5173")
    response.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    response.header("Access-Control-Allow-Headers", "Content-Type")

    if (request.method === "OPTIONS") {
        return response.sendStatus(204)
    }

    return next()
})

app.use("/app/bibilo/nuevo_libro", nuevo_libros)
app.use("/app/bibilo/autor/", autor)
app.use("/app/bibilo/", id)
app.use("/app/bibilo/buscador", buscador_libros)

app.use((error, request, response, next) => {
    const status = error instanceof ServerError ? error.status : 500
    const message = error.message ?? "Ocurrió un error interno en el servidor"

    return response.status(status).json({ message })
})

try {
    await connectDB()
} catch (error) {
    console.error("Error al conectar con MongoDB:", error.message)
    process.exit(1)
}

app.listen(PORT, () => {
    console.log("funciona")
})
