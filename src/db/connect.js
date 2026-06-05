import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"

function buildMongoUri() {
    if (process.env.MONGODB_URI) {
        return process.env.MONGODB_URI
    }

    const connectionString = process.env.MONGO_DB_CONNECTION_STRING ?? "mongodb://127.0.0.1:27017/"
    const dbName = process.env.MONGO_DB_NAME ?? "biblo"

    return `${connectionString.replace(/\/$/, "")}/${dbName}`
}

export async function connectDB() {
    const uri = buildMongoUri()
    const useMemoryDb = process.env.USE_MEMORY_DB === "true"

    if (useMemoryDb) {
        const memoryServer = await MongoMemoryServer.create()
        const memoryUri = memoryServer.getUri()

        await mongoose.connect(memoryUri)
        console.log("Conectado a MongoDB (memoria)")
        return
    }

    try {
        await mongoose.connect(uri)
        console.log("Conectado a MongoDB")
    } catch (error) {
        const isLocalhost =
            uri.includes("localhost") || uri.includes("127.0.0.1")

        if (!isLocalhost) {
            throw error
        }

        console.warn("MongoDB local no disponible, usando base de datos en memoria...")
        const memoryServer = await MongoMemoryServer.create()
        await mongoose.connect(memoryServer.getUri())
        console.log("Conectado a MongoDB (memoria)")
    }
}
