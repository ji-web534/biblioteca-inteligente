import "dotenv/config";
import app, { sembrarCategorias } from "./app.js";
import { connectDB } from "./db/connect.js";

const PORT = process.env.PORT || 8000;

try {
    await connectDB();
} catch (error) {
    console.error("Error al conectar con MongoDB:", error.message);
    process.exit(1);
}

try {
    await sembrarCategorias();
} catch (error) {
    console.error("Error al sembrar categorías:", error.message);
}

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
