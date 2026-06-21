import mongoose from 'mongoose'
const librosesquema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true
        },
        genero: {
            type: String
        },
        autor: {
            type: String
        },
         descripcion: {
            type: String,
         required: true
          
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