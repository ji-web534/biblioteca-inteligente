import { backendError } from "../helpers/error_class"

const API = 'http://localhost:8000/app/bibilo'

export async function solicitarCambioContraseña(email) {
    try {
        const response = await fetch(`${API}/cambiar-contraseña/solicitar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        })

        const resultado = await response.json()

        if (!response.ok) {
            throw new backendError(resultado.message || 'Error al solicitar cambio de contraseña.')
        }

        return resultado
    } catch (error) {
        const mensaje = error.message === 'Failed to fetch'
            ? 'Error de comunicación con el servidor'
            : error.message
        throw new Error(mensaje)
    }
}

export async function restablecerContraseña(token, nuevaContraseña) {
    try {
        const response = await fetch(`${API}/cambiar-contraseña/restablecer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, nuevaContraseña }),
        })

        const resultado = await response.json()

        if (!response.ok) {
            throw new backendError(resultado.message || 'Error al restablecer la contraseña.')
        }

        return resultado
    } catch (error) {
        const mensaje = error.message === 'Failed to fetch'
            ? 'Error de comunicación con el servidor'
            : error.message
        throw new Error(mensaje)
    }
}
