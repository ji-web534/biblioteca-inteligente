import mongoose from 'mongoose'
const moderacionSchema = new mongoose.Schema(
    {
        usuarioId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'usuario',
            required: true
        },
        contexto: {
            type: String,
            required: true,
            enum: ["biblioteca", "seccion", "genero"],
            default: "biblioteca"
        },
        contextoId: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'contextoRef',
            required: true
        },
        contextoRef: {
            type: String,
            required: true,
            enum: ["libro"],
            default: "libro"
        },
        permisos: {
            can_delete_books: { type: Boolean, default: false },
            can_edit_others_books: { type: Boolean, default: false },
            can_manage_categories: { type: Boolean, default: false }
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

moderacionSchema.index({ usuarioId: 1, contexto: 1, contextoId: 1 }, { unique: true })

export const MODERACION_COLLECTION_NAME = 'moderacion'
const MODERACION = mongoose.model(MODERACION_COLLECTION_NAME, moderacionSchema)

export default MODERACION