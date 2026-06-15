import { backendError } from "../helpers/error_class"

const API = 'http://localhost:8000/app/bibilo'

function getHeaders() {
    const token = localStorage.getItem('token')
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
}

export const obtenerFavoritos = async () => {
    const response = await fetch(`${API}/favoritos`, {
        headers: getHeaders()
    })
    const resultado = await response.json()
    if (!response.ok) {
        throw new backendError(resultado.message || 'Error al obtener favoritos.')
    }
    return resultado.data
}

export const agregarFavorito = async (libroId) => {
    const response = await fetch(`${API}/favoritos/${libroId}`, {
        method: 'POST',
        headers: getHeaders()
    })
    const resultado = await response.json()
    if (!response.ok) {
        throw new backendError(resultado.message || 'Error al agregar favorito.')
    }
    return resultado
}

export const quitarFavorito = async (libroId) => {
    const response = await fetch(`${API}/favoritos/${libroId}`, {
        method: 'DELETE',
        headers: getHeaders()
    })
    const resultado = await response.json()
    if (!response.ok) {
        throw new backendError(resultado.message || 'Error al quitar favorito.')
    }
    return resultado
}
