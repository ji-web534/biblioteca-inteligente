import { backendError } from "../helpers/error_class"
import { authFetch } from "./authFetch"

const API = 'http://localhost:8000/app/bibilo'

export const obtenerFavoritos = async () => {
    const response = await authFetch(`${API}/favoritos`)
    const resultado = await response.json()
    if (!response.ok) {
        throw new backendError(resultado.message || 'Error al obtener favoritos.')
    }
    return resultado.data
}

export const agregarFavorito = async (libroId) => {
    const response = await authFetch(`${API}/favoritos/${libroId}`, {
        method: 'POST'
    })
    const resultado = await response.json()
    if (!response.ok) {
        throw new backendError(resultado.message || 'Error al agregar favorito.')
    }
    return resultado
}

export const quitarFavorito = async (libroId) => {
    const response = await authFetch(`${API}/favoritos/${libroId}`, {
        method: 'DELETE'
    })
    const resultado = await response.json()
    if (!response.ok) {
        throw new backendError(resultado.message || 'Error al quitar favorito.')
    }
    return resultado
}
