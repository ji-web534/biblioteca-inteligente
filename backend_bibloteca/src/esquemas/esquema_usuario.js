import mongoose from 'mongoose'
const usuariosesquema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true
        },
        contraseña: {
            type: String,
            required: true
       
         
        },
         email: {
            type: String,
            required: true,
            unique: true
         
        },
        confirm: {
            type: Boolean,
            default: false,
            required: true
            
          
        },
        favoritos: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'libro'
        }],
    }
)
    export const USUARIO_COLLECTION_NAME = 'usuario'
const USUARIO = mongoose.model(USUARIO_COLLECTION_NAME,usuariosesquema)

export default USUARIO