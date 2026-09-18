import { backendError } from "../helpers/error_class"
import { authFetch } from "./authFetch"

const API = 'http://localhost:8000/app/bibilo'

export const obtenerComentarios = async (libroId) => {
    try {
        const response = await fetch(`${API}/comentarios/${libroId}`)
        const resultado = await response.json()
        if (!response.ok) {
            throw new backendError(resultado.message || 'Error al cargar los comentarios.')
        }
        return resultado.data
    } catch (error) {
        const mensaje = error.message === 'Failed to fetch'
            ? 'No se pudo conectar con el servidor.'
            : error.message
        alert(mensaje)
        return []
    }
}

export const crearComentario = async (libroId, texto) => {
    try {
        const response = await authFetch(`${API}/comentarios/${libroId}`, {
            method: 'POST',
            body: JSON.stringify({ texto })
        })
        const resultado = await response.json()
        if (!response.ok) {
            throw new backendError(resultado.message || 'Error al publicar el comentario.')
        }
        return resultado.data
    } catch (error) {
        const mensaje = error.message === 'Failed to fetch'
            ? 'No se pudo conectar con el servidor.'
            : error.message
        alert(mensaje)
        return null
    }
}

export const eliminarComentario = async (comentarioId) => {
    try {
        const response = await authFetch(`${API}/comentarios/${comentarioId}`, {
            method: 'DELETE'
        })
        const resultado = await response.json()
        if (!response.ok) {
            throw new backendError(resultado.message || 'Error al eliminar el comentario.')
        }
        return resultado
    } catch (error) {
        const mensaje = error.message === 'Failed to fetch'
            ? 'No se pudo conectar con el servidor.'
            : error.message
        alert(mensaje)
        return null
    }
}