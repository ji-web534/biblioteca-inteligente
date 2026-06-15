import { backendError } from "../helpers/error_class"

const API = 'http://localhost:8000/app/bibilo'

function getHeaders() {
    const token = localStorage.getItem('token')
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
}

export const crearLibro = async (nombreLibro, descripcionLibro) => {
    try {
        const response = await fetch(`${API}/nuevo_libro`, {
            method: 'POST',
            headers: getHeaders(),
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

export const obtenerMisLibros = async () => {
    const response = await fetch(`${API}/mis-libros`, {
        headers: getHeaders()
    })
    const resultado = await response.json()
    if (!response.ok) {
        throw new backendError(resultado.message || 'Error al obtener libros.')
    }
    return resultado.data
}
