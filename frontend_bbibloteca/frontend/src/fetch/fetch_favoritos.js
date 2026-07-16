import { backendError } from "../helpers/error_class"
import { authFetch } from "./authFetch"

const API = 'http://localhost:8000/app/bibilo'

export const obtenerFavoritos = async () => {
    try {
        const response = await authFetch(`${API}/favoritos`)
        const resultado = await response.json()
        if (!response.ok) {
            throw new backendError(resultado.message || 'Error al obtener favoritos.')
        }
        return resultado.data
    } catch (error) {
        console.error('Error al obtener favoritos:', error.message)
        return []
    }
}

export const agregarFavorito = async (libroId) => {
    try {
        const response = await authFetch(`${API}/favoritos/${libroId}`, {
            method: 'POST'
        })
        const resultado = await response.json()
        if (!response.ok) {
            throw new backendError(resultado.message || 'Error al agregar favorito.')
        }
        return resultado
    } catch (error) {
        console.error('Error al agregar favorito:', error.message)
        return null
    }
}

export const quitarFavorito = async (libroId) => {
    try {
        const response = await authFetch(`${API}/favoritos/${libroId}`, {
            method: 'DELETE'
        })
        const resultado = await response.json()
        if (!response.ok) {
            throw new backendError(resultado.message || 'Error al quitar favorito.')
        }
        return resultado
    } catch (error) {
        console.error('Error al quitar favorito:', error.message)
        return null
    }
}
