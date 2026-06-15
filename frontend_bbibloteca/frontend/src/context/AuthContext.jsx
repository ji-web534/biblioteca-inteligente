import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null)
    const [token, setToken] = useState(null)

    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        const storedUsuario = localStorage.getItem('usuario')
        if (storedToken && storedUsuario) {
            setToken(storedToken)
            setUsuario(JSON.parse(storedUsuario))
        }
    }, [])

    const login = (token, usuarioData) => {
        setToken(token)
        setUsuario(usuarioData)
        localStorage.setItem('token', token)
        localStorage.setItem('usuario', JSON.stringify(usuarioData))
    }

    const logout = () => {
        setToken(null)
        setUsuario(null)
        localStorage.removeItem('token')
        localStorage.removeItem('usuario')
    }

    return (
        <AuthContext.Provider value={{ usuario, token, login, logout, estaAutenticado: !!token }}>
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
