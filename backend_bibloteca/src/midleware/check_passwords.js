import "dotenv/config"
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import USUARIO from "./src/esquemas/esquema_usuario.js"
import { connectDB } from "./src/db/connect.js"

async function fixPasswords() {
    try {
        await connectDB()

        const usuarios = await USUARIO.find()
        console.log("Total usuarios:", usuarios.length)

        for (const user of usuarios) {
            const passwordMatch = await bcrypt.compare("123456", user.contraseña)
            console.log(`${user.email} | hash: ${user.contraseña?.substring(0, 20)}... | match "123456": ${passwordMatch}`)
        }

        process.exit(0)
    } catch (error) {
        console.error("Error:", error.message)
        process.exit(1)
    }
}

fixPasswords()