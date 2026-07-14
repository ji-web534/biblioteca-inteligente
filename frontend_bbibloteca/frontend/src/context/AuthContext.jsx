import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

const API = 'http://localhost:8000/app/bibilo'

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null)
    const [token, setToken] = useState(null)
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        const storedUsuario = localStorage.getItem('usuario')
        if (storedUsuario) {
            setUsuario(JSON.parse(storedUsuario))
            refreshAccessToken()
        } else {
            setCargando(false)
        }
    }, [])

    const refreshAccessToken = async () => {
        try {
            const response = await fetch(`${API}/refresh`, {
                method: 'POST',
                credentials: 'include'
            })

            if (!response.ok) {
                throw new Error('Refresh failed')
            }

            const resultado = await response.json()
            setToken(resultado.token)
        } catch (error) {
            setToken(null)
            setUsuario(null)
            localStorage.removeItem('usuario')
        } finally {
            setCargando(false)
        }
    }

    const login = async (email, contraseña) => {
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

        setToken(resultado.token)
        setUsuario(resultado.data)
        localStorage.setItem('usuario', JSON.stringify(resultado.data))

        return resultado
    }

    const logout = async () => {
        try {
            await fetch(`${API}/logout`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                credentials: 'include'
            })
        } catch (error) {
            console.error('Error al cerrar sesión:', error)
        } finally {
            setToken(null)
            setUsuario(null)
            localStorage.removeItem('usuario')
        }
    }

    const authFetch = useCallback(async (url, options = {}) => {
        let response = await fetch(url, {
            ...options,
            credentials: 'include',
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${token}`
            }
        })

        if (response.status === 401) {
            try {
                const refreshResponse = await fetch(`${API}/refresh`, {
                    method: 'POST',
                    credentials: 'include'
                })

                if (refreshResponse.ok) {
                    const refreshData = await refreshResponse.json()
                    setToken(refreshData.token)

                    response = await fetch(url, {
                        ...options,
                        credentials: 'include',
                        headers: {
                            ...options.headers,
                            'Authorization': `Bearer ${refreshData.token}`
                        }
                    })
                } else {
                    setToken(null)
                    setUsuario(null)
                    localStorage.removeItem('usuario')
                }
            } catch (error) {
                setToken(null)
                setUsuario(null)
                localStorage.removeItem('usuario')
            }
        }

        return response
    }, [token])

    const tieneRol = (rol) => {
        return usuario?.role === rol
    }

    const tienePermiso = (permiso) => {
        if (usuario?.role === 'admin') return true
        return usuario?.permisos?.[permiso] === true
    }

    const esAdmin = () => tieneRol('admin')
    const esModerador = () => usuario?.role === 'admin' || usuario?.role === 'moderator'

    return (
        <AuthContext.Provider value={{
            usuario,
            token,
            cargando,
            login,
            logout,
            refreshAccessToken,
            authFetch,
            estaAutenticado: !!token,
            tieneRol,
            tienePermiso,
            esAdmin,
            esModerador
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider')
    }
    return context
}
