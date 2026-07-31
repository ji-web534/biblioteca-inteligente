import "dotenv/config"
import express from "express"
import cookieParser from "cookie-parser"
import createBook from "./end_point/createBook.js"
import id from "./end_point/id.js"
import author from "./end_point/author.js"
import { connectDB } from "./db/connect.js"
import errorHandler from "./midleware/error_handler.js"
import buscador_libros from "./servicios/buscador_libros.js"
import searchBooks from "./end_point/searchBooks.js"
import register from "./end_point/register.js"
import confirmEmail from "./end_point/confirmEmail.js"
import login from "./end_point/login.js"
import logout from "./end_point/logout.js"
import refresh from "./end_point/refresh.js"
import myBooks from "./end_point/myBooks.js"
import favorites from "./end_point/favorites.js"
import changePassword from "./end_point/changePassword.js"
import editBook from "./end_point/editBook.js"
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

app.use("/app/bibilo/nuevo_libro", createBook)
app.use("/app/bibilo/autor/", author)
app.use("/app/bibilo/buscador", buscador_libros)
app.use("/app/bibilo/libros", searchBooks)
app.use("/app/bibilo/nuevo_usuario", register)
app.use("/app/bibilo/verificacion", confirmEmail)
app.use("/app/bibilo/login", login)
app.use("/app/bibilo/logout", logout)
app.use("/app/bibilo/refresh", refresh)
app.use("/app/bibilo/mis-libros", myBooks)
app.use("/app/bibilo/libro", editBook)
app.use("/app/bibilo/libro", eliminar_libro)
app.use("/app/bibilo/libro", hard_delete_libro)
app.use("/app/bibilo/admin/usuarios", admin_usuarios)
app.use("/app/bibilo/favoritos", favorites)
app.use("/app/bibilo/cambiar-contraseña", changePassword)
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
