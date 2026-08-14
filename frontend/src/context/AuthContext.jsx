import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { actualizarToken, API } from '../fetch/authFetch'
import { iniciarSesion, updateProfile } from '../fetch/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null)
    const [token, setToken] = useState(null)
    const [cargando, setCargando] = useState(true)

    const refreshAccessToken = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:8000/app/bibilo/refresh', {
                method: 'POST',
                credentials: 'include'
            })

            if (!response.ok) {
                throw new Error('Refresh failed')
            }

            const resultado = await response.json()
            setToken(resultado.token)
            actualizarToken(resultado.token)
        } catch (error) {
            setToken(null)
            setUsuario(null)
            localStorage.removeItem('usuario')
            actualizarToken(null)
        } finally {
            setCargando(false)
        }
    }, [])

    useEffect(() => {
        const storedUsuario = localStorage.getItem('usuario')
        if (storedUsuario) {
            setUsuario(JSON.parse(storedUsuario))
            refreshAccessToken()
        } else {
            setCargando(false)
        }
    }, [refreshAccessToken])

    const login = async (email, contraseña) => {
        const resultado = await iniciarSesion(email, contraseña)

        setToken(resultado.token)
        setUsuario(resultado.data)
        localStorage.setItem('usuario', JSON.stringify(resultado.data))
        actualizarToken(resultado.token)

        return resultado
    }

    const updateProfileContext = async (nombre, email) => {
        const data = await updateProfile(nombre, email)
        if (data) {
            setUsuario(data)
            localStorage.setItem('usuario', JSON.stringify(data))
        }
        return data
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
            actualizarToken(null)
        }
    }

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
            updateProfileContext,
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
