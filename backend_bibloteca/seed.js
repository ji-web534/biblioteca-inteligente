import "dotenv/config"
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import USUARIO from "./src/esquemas/esquema_usuario.js"
import CATEGORIA from "./src/esquemas/esquema_categoria.js"
import { connectDB } from "./src/db/connect.js"

const categoriasTest = [
    {
        nombre: "terror",
        descripcion: "Obras que buscan generar miedo o suspense."
    },
    {
        nombre: "fantasia",
        descripcion: "Historias con mundos, magia o seres imaginarios."
    },
    {
        nombre: "romance",
        descripcion: "Narraciones centradas en relaciones amorosas."
    }
]

const usuariosTest = [
    {
        nombre: "Admin Biblioteca",
        email: "admin@test.com",
        contraseña: "123456",
        role: "admin",
        confirm: true,
        permisos: {
            can_delete_books: true,
            can_suspend_users: true,
            can_edit_others_books: true,
            can_manage_categories: true,
            can_manage_users: true
        }
    },
    {
        nombre: "Juan Perez",
        email: "juan@test.com",
        contraseña: "123456",
        role: "moderator",
        confirm: true,
        permisos: {
            can_delete_books: true,
            can_suspend_users: false,
            can_edit_others_books: false,
            can_manage_categories: true,
            can_manage_users: false
        }
    },
    {
        nombre: "Maria Garcia",
        email: "maria@test.com",
        contraseña: "123456",
        role: "user",
        confirm: true,
        permisos: {
            can_delete_books: false,
            can_suspend_users: false,
            can_edit_others_books: false,
            can_manage_categories: false,
            can_manage_users: false
        }
    }
]

async function seed() {
    try {
        await connectDB()
        console.log("Conectado a MongoDB")

        for (const userData of usuariosTest) {
            const existe = await USUARIO.findOne({ email: userData.email })
            if (existe) {
                console.log(`Ya existe: ${userData.email}`)
                continue
            }

            const hashedPassword = await bcrypt.hash(userData.contraseña, 10)
            const usuario = new USUARIO({
                nombre: userData.nombre,
                email: userData.email,
                contraseña: hashedPassword,
                role: userData.role,
                confirm: userData.confirm,
                permisos: userData.permisos
            })
            await usuario.save()
            console.log(`Creado: ${userData.email} | Pass: ${userData.contraseña} | Role: ${userData.role}`)
        }

        for (const catData of categoriasTest) {
            const existe = await CATEGORIA.findOne({ nombre: catData.nombre })
            if (existe) {
                console.log(`Categoría ya existe: ${catData.nombre}`)
                continue
            }

            const categoria = new CATEGORIA(catData)
            await categoria.save()
            console.log(`Categoría creada: ${catData.nombre}`)
        }

        console.log("\n--- Usuarios de prueba ---")
        for (const u of usuariosTest) {
            console.log(`Email: ${u.email} | Pass: ${u.contraseña} | Role: ${u.role}`)
        }

        process.exit(0)
    } catch (error) {
        console.error("Error:", error.message)
        process.exit(1)
    }
}

seed()