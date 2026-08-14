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
import changePassword from "./end_point/changePassword.js"
import favorites from "./end_point/favorites.js"
import updateProfile from "./end_point/updateProfile.js"
import editBook from "./end_point/editBook.js"
import restoreBook from "./end_point/restoreBook.js"
import deleteBook from "./end_point/deleteBook.js"
import hardDeleteBook from "./end_point/hardDeleteBook.js"
import adminBooks from "./end_point/adminBooks.js"
import adminUsers from "./end_point/adminUsers.js"
import category from "./end_point/category.js"
import CATEGORIA from "./esquemas/esquema_categoria.js"
const app = express()
const PORT = 8000

const categoriasPorDefecto = [
    { nombre: "terror", descripcion: "Obras que buscan generar miedo o suspense." },
    { nombre: "fantasia", descripcion: "Historias con mundos, magia o seres imaginarios." },
    { nombre: "romance", descripcion: "Narraciones centradas en relaciones amorosas." }
]

async function sembrarCategorias() {
    for (const categoria of categoriasPorDefecto) {
        await CATEGORIA.findOneAndUpdate(
            { nombre: categoria.nombre },
            { $setOnInsert: categoria },
            { upsert: true }
        )
    }
}

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
app.use("/app/bibilo/libro", restoreBook)
app.use("/app/bibilo/libro", deleteBook)
app.use("/app/bibilo/libro", hardDeleteBook)
app.use("/app/bibilo/admin/libros", adminBooks)
app.use("/app/bibilo/admin/usuarios", adminUsers)
app.use("/app/bibilo/categorias", category)
app.use("/app/bibilo/favoritos", favorites)
app.use("/app/bibilo", updateProfile)
app.use("/app/bibilo/cambiar-contraseña", changePassword)
app.use("/app/bibilo/", id)
app.use(errorHandler)

try {
    await connectDB()
} catch (error) {
    console.error("Error al conectar con MongoDB:", error.message)
    process.exit(1)
}

try {
    await sembrarCategorias()
} catch (error) {
    console.error("Error al sembrar categorías:", error.message)
}

app.listen(PORT, () => {
    console.log("funciona")
})
