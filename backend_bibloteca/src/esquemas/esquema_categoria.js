import mongoose from "mongoose"

const categoriaSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            maxlength: 50
        },
        descripcion: {
            type: String,
            default: "",
            maxlength: 200
        },
        activo: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
)

export const CATEGORIA_COLLECTION_NAME = "categoria"
const CATEGORIA = mongoose.model(CATEGORIA_COLLECTION_NAME, categoriaSchema)

export default CATEGORIA