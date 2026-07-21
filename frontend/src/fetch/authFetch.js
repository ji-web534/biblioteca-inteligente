const API = 'http://localhost:8000/app/bibilo'

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

        return await fetch(url, {
            ...options,
            credentials: 'include',
            headers: {
                ...options.headers,
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${refreshData.token}`
            }
        })
    } catch (error) {
        actualizarToken(null)
        throw error
    }
}

export async function authFetch(url, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
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