import { haySesion, marcarSesion, limpiarSesion } from './tokenStore'

export const API = 'http://localhost:8000/app/bibilo'

let refreshEnProceso = null

async function refrescarSesion() {
    if (refreshEnProceso) {
        return refreshEnProceso
    }

    refreshEnProceso = fetch(`${API}/refresh`, {
        method: 'POST',
        credentials: 'include'
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Refresh failed')
            }
            return response.json()
        })
        .then(() => {
            marcarSesion()
        })
        .catch((error) => {
            limpiarSesion()
            throw error
        })
        .finally(() => {
            refreshEnProceso = null
        })

    return refreshEnProceso
}

export async function authFetch(url, options = {}) {
    const esFormData = typeof FormData !== 'undefined' && options.body instanceof FormData
    const headers = {
        ...(esFormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers
    }

    const ejecutar = () =>
        fetch(url, {
            ...options,
            credentials: 'include',
            headers
        })

    let response = await ejecutar()

    if (response.status === 401 && haySesion()) {
        await refrescarSesion()
        response = await ejecutar()
    }

    return response
}