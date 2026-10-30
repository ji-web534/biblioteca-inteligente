import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import ENVIRONMENT from "../config/environment.js";
import createBook from "./routes/createBook.js";
import id from "./routes/id.js";
import author from "./routes/author.js";
import buscador_libros from "./servicios/buscador_libros.js";
import searchBooks from "./routes/searchBooks.js";
import register from "./routes/register.js";
import confirmEmail from "./routes/confirmEmail.js";
import reenviarConfirmacion from "./routes/reenviarConfirmacion.js";
import login from "./routes/login.js";
import logout from "./routes/logout.js";
import refresh from "./routes/refresh.js";
import myBooks from "./routes/myBooks.js";
import changePassword from "./routes/changePassword.js";
import favorites from "./routes/favorites.js";
import comentarios from "./routes/comentarios.js";
import updateProfile from "./routes/updateProfile.js";
import uploadPortada from "./routes/upload_portada.js";
import editBook from "./routes/editBook.js";
import restoreBook from "./routes/restoreBook.js";
import deleteBook from "./routes/deleteBook.js";
import hardDeleteBook from "./routes/hardDeleteBook.js";
import adminBooks from "./routes/adminBooks.js";
import adminUsers from "./routes/adminUsers.js";
import category from "./routes/category.js";
import {
    limitarLogin,
    limitarRegistro,
    limitarRefresh,
    limitarVerificacion,
    limitarReenvioVerificacion
} from "./middlewares/rate_limit.js";
import errorHandler from "./middlewares/error_handler.js";
import CATEGORIA from "./models/esquema_categoria.js";

const app = express();

const categoriasPorDefecto = [
    { nombre: "terror", descripcion: "Obras que buscan generar miedo o suspense." },
    { nombre: "fantasia", descripcion: "Historias con mundos, magia o seres imaginarios." },
    { nombre: "romance", descripcion: "Narraciones centradas en relaciones amorosas." }
];

export async function sembrarCategorias() {
    for (const categoria of categoriasPorDefecto) {
        await CATEGORIA.findOneAndUpdate(
            { nombre: categoria.nombre },
            { $setOnInsert: categoria },
            { upsert: true }
        );
    }
}

app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false
}));

app.use((request, response, next) => {
    response.header("Access-Control-Allow-Origin", ENVIRONMENT.URL_FRONTEND ?? "http://localhost:5173");
    response.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    response.header("Access-Control-Allow-Credentials", "true");

    if (request.method === "OPTIONS") {
        return response.sendStatus(204);
    }

    return next();
});

app.use("/app/bibilo/nuevo_libro", createBook);
app.use("/app/bibilo/autor/", author);
app.use("/app/bibilo/buscador", buscador_libros);
app.use("/app/bibilo/libros", searchBooks);
app.use("/app/bibilo/nuevo_usuario", limitarRegistro, register);
app.use("/app/bibilo/verificacion", limitarVerificacion, confirmEmail);
app.use("/app/bibilo/reenviar-verificacion", limitarReenvioVerificacion, reenviarConfirmacion);
app.use("/app/bibilo/login", limitarLogin, login);
app.use("/app/bibilo/logout", logout);
app.use("/app/bibilo/refresh", limitarRefresh, refresh);
app.use("/app/bibilo/mis-libros", myBooks);
app.use("/app/bibilo/libro", editBook);
app.use("/app/bibilo/libro", restoreBook);
app.use("/app/bibilo/libro", deleteBook);
app.use("/app/bibilo/libro", hardDeleteBook);
app.use("/app/bibilo/admin/libros", adminBooks);
app.use("/app/bibilo/admin/usuarios", adminUsers);
app.use("/app/bibilo/categorias", category);
app.use("/app/bibilo/favoritos", favorites);
app.use("/app/bibilo/comentarios", comentarios);
app.use("/app/bibilo/portada", uploadPortada);
app.use("/app/bibilo", updateProfile);
app.use("/app/bibilo/cambiar-contraseña", changePassword);
app.use("/app/bibilo/", id);
app.use(errorHandler);

export default app;
