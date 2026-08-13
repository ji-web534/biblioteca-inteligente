import { backendError } from "../helpers/error_class"
import { authFetch } from "./authFetch"

const API = 'http://localhost:8000/app/biblio'

export async function iniciarSesion(email, contraseña) {
    const response = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, contraseña })
    })

    const resultado = await response.json()

    if (!response.ok) {
        throw new Error(resultado.message || 'Error al iniciar sesión')
    }

    return resultado
}

export async function registrarUsuario(nombre, email, contraseña) {
    try {
        const response = await fetch(`${API}/nuevo_usuario`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, contraseña, email })
        })

        const resultado = await response.json()

        if (!response.ok) {
            throw new backendError(resultado.message || 'Hubo un problema al crear el usuario.')
        }

        return resultado.data
    } catch (error) {
        const mensaje = error.message === 'Failed to fetch'
            ? 'Error de comunicación con el servidor'
            : error.message
        throw new Error(mensaje)
    }
}

export async function confirmarEmail(token) {
    const response = await fetch(`${API}/verificacion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
    })

    const resultado = await response.json()

    if (!response.ok) {
        throw new backendError(resultado.message || 'No se pudo verificar la cuenta.')
    }

    return resultado
}

export async function updateProfile(nombre, email) {
    try {
        const response = await authFetch(`${API}/profile`, {
            method: 'PUT',
            body: JSON.stringify({ nombre, email })
        })

        const resultado = await response.json()

        if (!response.ok) {
            throw new backendError(resultado.message || 'Hubo un problema al actualizar el perfil.')
        }

        return resultado.data
    } catch (error) {
        const mensaje =
            error.message === 'Failed to fetch'
                ? 'No se pudo conectar con el servidor.'
                : error.message
        alert(mensaje)
        return null
    }
}
