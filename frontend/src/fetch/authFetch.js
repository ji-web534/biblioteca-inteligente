import { haySesion, marcarSesion, limpiarSesion } from './tokenStore'

export const API = 'http://localhost:8000/app/bibilo'

async function refreshYReintentar(url, options) {
    try {
        const refreshResponse = await fetch(`${API}/refresh`, {
            method: 'POST',
            credentials: 'include'
        })

        if (!refreshResponse.ok) {
            throw new Error('Refresh failed')
        }

        await refreshResponse.json()
        marcarSesion()

        const esFormData = typeof FormData !== 'undefined' && options.body instanceof FormData
        return await fetch(url, {
            ...options,
            credentials: 'include',
            headers: {
                ...(esFormData ? {} : { 'Content-Type': 'application/json' }),
                ...options.headers
            }
        })
    } catch (error) {
        limpiarSesion()
        throw error
    }
}

export async function authFetch(url, options = {}) {
    const esFormData = typeof FormData !== 'undefined' && options.body instanceof FormData
    const headers = {
        ...(esFormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers
    }

    let response = await fetch(url, {
        ...options,
        credentials: 'include',
        headers
    })

    if (response.status === 401 && haySesion()) {
        response = await refreshYReintentar(url, options)
    }

    return response
}