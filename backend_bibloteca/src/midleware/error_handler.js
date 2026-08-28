import ServerError from "../helpers/error_class.js"

const errorHandler = (error, request, response, next) => {
    if (
        error.name === "MongoNetworkError" ||
        error.name === "MongoTimeoutError" ||
        error.name === "MongoServerSelectionError" ||
        error.code === "ECONNREFUSED" ||
        error.code === "ETIMEOUT" ||
        error.code === "ENOTFOUND" ||
        error.code === "ECONNRESET"
    ) {
        return response.status(503).json({
            message: "Error de conexión con el servidor de base de datos."
        })
    }

    if (error instanceof ServerError) {
        return response.status(error.status).json({ message: error.message })
    }

    if (error.name === "ValidationError") {
        const message = Object.values(error.errors)
            .map((err) => err.message)
            .join(" ")
        return response.status(400).json({ message })
    }

    if (process.env.MODE !== "production") {
        console.error("[ERROR]", error)
    }

    return response.status(500).json({
        message: "Ocurrió un error interno en el servidor."
    })
}

export default errorHandler
