import "dotenv/config"
import mongoose from "mongoose"
import USUARIO from "./src/esquemas/esquema_usuario.js"
import { connectDB } from "./src/db/connect.js"

async function check() {
    try {
        await connectDB()
        
        const usuarios = await USUARIO.find().select("-contraseña")
        console.log("Total usuarios:", usuarios.length)
        console.log(JSON.stringify(usuarios, null, 2))

        process.exit(0)
    } catch (error) {
        console.error("Error:", error.message)
        process.exit(1)
    }
}

check()