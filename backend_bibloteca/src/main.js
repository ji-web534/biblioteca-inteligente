import "dotenv/config"
import express from "express"
import cookieParser from "cookie-parser"
import nuevo_libros from "./end_point/nuevo_libros.js"
import id from "./end_point/id.js"
import autor from "./end_point/Autor.js"
import { connectDB } from "./db/connect.js"
import errorHandler from "./midleware/error_handler.js"
import buscador_libros from "./servicios/buscador_libros.js"
import buscar_libros from "./end_point/buscar_libros.js"
import nuevo_usuario from "./end_point/nuevo_usuario.js"
import confir_email from "./end_point/confir_email.js"
import login from "./end_point/login.js"
import logout from "./end_point/logout.js"
import refresh from "./end_point/refresh.js"
import mis_libros from "./end_point/mis_libros.js"
import favoritos from "./end_point/favoritos.js"
import cambiar_contraseña from "./end_point/cambiar_contraseña.js"
import editar_libro from "./end_point/editar_libro.js"
import eliminar_libro from "./end_point/eliminar_libro.js"
import hard_delete_libro from "./end_point/hard_delete_libro.js"
import admin_usuarios from "./end_point/admin_usuarios.js"
const app = express()
const PORT = 8000

app.use(express.json())
app.use(cookieParser())

app.use((request, response, next) => {
    response.header("Access-Control-Allow-Origin", "http://localhost:5173")
    response.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.header("Access-Control-Allow-Headers", "Content-Type, Authorization")
    response.header("Access-Control-Allow-Credentials", "true")

    if (request.method === "OPTIONS") {
        return response.sendStatus(204)
    }

    return next()
})

app.use("/app/bibilo/nuevo_libro", nuevo_libros)
app.use("/app/bibilo/autor/", autor)
app.use("/app/bibilo/buscador", buscador_libros)
app.use("/app/bibilo/libros", buscar_libros)
app.use("/app/bibilo/nuevo_usuario", nuevo_usuario)
app.use("/app/bibilo/verificacion", confir_email)
app.use("/app/bibilo/login", login)
app.use("/app/bibilo/logout", logout)
app.use("/app/bibilo/refresh", refresh)
app.use("/app/bibilo/mis-libros", mis_libros)
app.use("/app/bibilo/libro", editar_libro)
app.use("/app/bibilo/libro", eliminar_libro)
app.use("/app/bibilo/libro", hard_delete_libro)
app.use("/app/bibilo/admin/usuarios", admin_usuarios)
app.use("/app/bibilo/favoritos", favoritos)
app.use("/app/bibilo/cambiar-contraseña", cambiar_contraseña)
app.use("/app/bibilo/", id)
app.use(errorHandler)

try {
    await connectDB()
} catch (error) {
    console.error("Error al conectar con MongoDB:", error.message)
    process.exit(1)
}

app.listen(PORT, () => {
    console.log("funciona")
})
