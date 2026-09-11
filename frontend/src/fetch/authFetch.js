import { getToken, setToken, clearToken } from './tokenStore'

export const API = 'http://localhost:8000/app/bibilo'

export function actualizarToken(nuevoToken) {
    if (!nuevoToken) {
        clearToken()
        return
    }
    setToken(nuevoToken)
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
        setToken(refreshData.token)

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
        clearToken()
        throw error
    }
}

export async function authFetch(url, options = {}) {
    const esFormData = typeof FormData !== 'undefined' && options.body instanceof FormData
    const token = getToken()
    const headers = {
        ...(esFormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }

    let response = await fetch(url, {
        ...options,
        credentials: 'include',
        headers
    })

    if (response.status === 401 && getToken()) {
        response = await refreshYReintentar(url, options)
    }

    return response
}