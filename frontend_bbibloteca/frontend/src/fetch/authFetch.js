const API = 'http://localhost:8000/app/bibilo'

let tokenActual = null
let setTokenCallback = null

export function setToken(token) {
    tokenActual = token
}

export function setTokenRefresher(callback) {
    setTokenCallback = callback
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
        tokenActual = refreshData.token

        if (setTokenCallback) {
            setTokenCallback(refreshData.token)
        }

        return await fetch(url, {
            ...options,
            credentials: 'include',
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${refreshData.token}`
            }
        })
    } catch (error) {
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