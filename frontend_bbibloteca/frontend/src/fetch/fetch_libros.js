import { backendError } from "../helpers/error_class"
import { authFetch } from "./authFetch"

const API = 'http://localhost:8000/app/bibilo'

export const crearLibro = async (nombreLibro, descripcionLibro) => {
    try {
        const response = await authFetch(`${API}/nuevo_libro`, {
            method: 'POST',
            body: JSON.stringify({
                nombre: nombreLibro,
                descripcion: descripcionLibro
            })
        })

        const resultado = await response.json()

        if (!response.ok) {
            throw new backendError(resultado.message || 'Hubo un problema al crear el libro.')
        }

        return resultado.data
    } catch (error) {
        const mensaje = error.message === 'Failed to fetch'
            ? 'No se pudo conectar con el servidor.'
            : error.message
        alert(mensaje)
    }
}

export const buscarLibros = async (termino) => {
    try {
        const response = await fetch(`${API}/libros/buscar?q=${encodeURIComponent(termino)}`)
        const resultado = await response.json()
        if (!response.ok) {
            throw new backendError(resultado.message || 'Error al buscar libros.')
        }
        return resultado.data
    } catch (error) {
        const mensaje = error.message === 'Failed to fetch'
            ? 'No se pudo conectar con el servidor.'
            : error.message
        alert(mensaje)
    }
}

export const editarLibro = async (id, datos) => {
    try {
        const response = await authFetch(`${API}/libro/${id}`, {
            method: 'PUT',
            body: JSON.stringify(datos)
        })
        const resultado = await response.json()
        if (!response.ok) {
            throw new backendError(resultado.message || 'Error al editar el libro.')
        }
        return resultado.data
    } catch (error) {
        const mensaje = error.message === 'Failed to fetch'
            ? 'No se pudo conectar con el servidor.'
            : error.message
        alert(mensaje)
    }
}

export const obtenerMisLibros = async () => {
    try {
        const response = await authFetch(`${API}/mis-libros`)
        const resultado = await response.json()
        if (!response.ok) {
            throw new backendError(resultado.message || 'Error al obtener libros.')
        }
        return resultado.data
    } catch (error) {
        const mensaje = error.message === 'Failed to fetch'
            ? 'No se pudo conectar con el servidor.'
            : error.message
        alert(mensaje)
    }
}
