export default function serializarUsuario(usuario) {
    const { _id, nombre, email, role, permisos } = usuario.toObject()
    return { _id, nombre, email, role, permisos }
}