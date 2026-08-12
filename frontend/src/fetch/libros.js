import { backendError } from "../helpers/error_class"
import { authFetch } from "./authFetch"

const API = 'http://localhost:8000/app/bibilo'

export const crearLibro = async (nombreLibro, descripcionLibro, textoLibro, genero = '') => {
    try {
        const response = await authFetch(`${API}/nuevo_libro`, {
            method: 'POST',
            body: JSON.stringify({
                nombre: nombreLibro,
                descripcion: descripcionLibro,
                texto: textoLibro,
                genero
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
        return null
    }
}

export const buscarLibros = async (termino, filtros = {}, page = 1, limit = 20) => {
    try {
        const params = new URLSearchParams()
        if (termino) params.set('q', termino)
        if (filtros.genero) params.set('genero', filtros.genero)
        if (filtros.autor) params.set('autor', filtros.autor)
        if (filtros.desde) params.set('desde', filtros.desde)
        if (filtros.hasta) params.set('hasta', filtros.hasta)
        params.set('page', String(page))
        params.set('limit', String(limit))
        const response = await fetch(`${API}/libros/buscar?${params.toString()}`)
        const resultado = await response.json()
        if (!response.ok) {
            throw new backendError(resultado.message || 'Error al buscar libros.')
        }
        return resultado
    } catch (error) {
        const mensaje = error.message === 'Failed to fetch'
            ? 'No se pudo conectar con el servidor.'
            : error.message
        alert(mensaje)
        return { data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 1 } }
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
        return null
    }
}

export const obtenerLibroPorId = async (id) => {
    try {
        const response = await fetch(`${API}/${id}`)
        const resultado = await response.json()
        if (!response.ok) {
            throw new backendError(resultado.message || 'Error al obtener el libro.')
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

export const obtenerMisLibros = async (page = 1, limit = 20) => {
    try {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) })
        const response = await authFetch(`${API}/mis-libros?${params.toString()}`)
        const resultado = await response.json()
        if (!response.ok) {
            if (response.status === 401) {
                const mensaje = 'Token de autenticación requerido.'
                console.error(mensaje)
                return { data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 1 } }
            }
            throw new backendError(resultado.message || 'Error al obtener libros.')
        }
        return resultado
    } catch (error) {
        const mensaje = error.message === 'Failed to fetch'
            ? 'No se pudo conectar con el servidor.'
            : error.message
        console.error(mensaje)
        return { data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 1 } }
    }
}

export const removerLibro = async (libroId) => {
    try {
        const response = await authFetch(`${API}/libro/${libroId}`, {
            method: 'DELETE'
        })
        const resultado = await response.json()
        if (!response.ok) {
            throw new backendError(resultado.message || 'Error al remover el libro.')
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

export const eliminarLibro = async (libroId) => {
    try {
        const response = await authFetch(`${API}/libro/${libroId}/hard`, {
            method: 'DELETE'
        })
        const resultado = await response.json()
        if (!response.ok) {
            throw new backendError(resultado.message || 'Error al eliminar el libro permanentemente.')
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

export const restaurarLibro = async (libroId) => {
    try {
        const response = await authFetch(`${API}/libro/${libroId}/restore`, {
            method: 'PUT'
        })
        const resultado = await response.json()
        if (!response.ok) {
            throw new backendError(resultado.message || 'Error al restaurar el libro.')
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
