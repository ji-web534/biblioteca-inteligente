import mongoose from 'mongoose'

const permisosSchema = new mongoose.Schema({
    can_delete_books: { type: Boolean, default: false },
    can_suspend_users: { type: Boolean, default: false },
    can_edit_others_books: { type: Boolean, default: false },
    can_manage_categories: { type: Boolean, default: false },
    can_manage_users: { type: Boolean, default: false }
}, { _id: false })

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
        role: {
            type: String,
            enum: ["user", "moderator", "admin"],
            default: "user"
        },
        permisos: {
            type: permisosSchema,
            default: () => ({})
        },
        favoritos: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'libro'
        }],
        refreshToken: {
            type: String,
            default: null
        },
    }
)

export const USUARIO_COLLECTION_NAME = 'usuario'
const USUARIO = mongoose.model(USUARIO_COLLECTION_NAME, usuariosesquema)

export default USUARIO