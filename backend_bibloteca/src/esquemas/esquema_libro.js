import mongoose from 'mongoose'
const librosesquema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            maxlength: 50
        },
        genero: {
            type: String,
            maxlength: 15
        },
        autor: {
            type: String,
            maxlength: 15
        },
        descripcion: {
            type: String,
            required: true,
            maxlength: 150
        },
        usuarioId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'usuario',
            required: false
        },
    }
)
export const LIBRO_COLLECTION_NAME = 'libro'
const LIBRO = mongoose.model(LIBRO_COLLECTION_NAME,librosesquema)

export default LIBRO