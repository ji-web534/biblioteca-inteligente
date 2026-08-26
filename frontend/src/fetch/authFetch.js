export const API = 'http://localhost:8000/app/bibilo'

let tokenActual = null

export function actualizarToken(nuevoToken) {
    tokenActual = nuevoToken
}

async function refreshYReintentar(url, options) {
    try {
        const refreshResponse = await fetch(`${API}/refresh`, {
            method: 'POST',
            credentials: 'include'
        })

        if (!refreshResponse.ok) {
            throw new Error('Refresh failed')
        }

        const refreshData = await refreshResponse.json()
        actualizarToken(refreshData.token)

        const esFormData = typeof FormData !== 'undefined' && options.body instanceof FormData
        return await fetch(url, {
            ...options,
            credentials: 'include',
            headers: {
                ...(esFormData ? {} : { 'Content-Type': 'application/json' }),
                ...options.headers,
                'Authorization': `Bearer ${refreshData.token}`
            }
        })
    } catch (error) {
        actualizarToken(null)
        throw error
    }
}

export async function authFetch(url, options = {}) {
    const esFormData = typeof FormData !== 'undefined' && options.body instanceof FormData
    const headers = {
        ...(esFormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
        ...(tokenActual ? { 'Authorization': `Bearer ${tokenActual}` } : {})
    }

    let response = await fetch(url, {
        ...options,
        credentials: 'include',
        headers
    })

    if (response.status === 401 && tokenActual) {
        response = await refreshYReintentar(url, options)
    }

    return response
}

export function getToken() {
    return tokenActual
}