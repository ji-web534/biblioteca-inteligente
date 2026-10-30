import mongoose from 'mongoose'

const comentariosesquema = new mongoose.Schema(
    {
        libroId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'libro',
            required: true
        },
        usuarioId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'usuario',
            required: true
        },
        texto: {
            type: String,
            required: true,
            maxlength: 500
        }
    },
    { timestamps: true }
)

comentariosesquema.index({ libroId: 1, createdAt: -1 })

export const COMENTARIO_COLLECTION_NAME = 'comentario'
const COMENTARIO = mongoose.model(COMENTARIO_COLLECTION_NAME, comentariosesquema)

export default COMENTARIO