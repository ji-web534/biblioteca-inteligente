import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Iniciar_sesion() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [guardando, setGuardando] = useState(false)
    const [errorMensaje, setErrorMensaje] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMensaje('')
        setGuardando(true)

        try {
            const response = await fetch('http://localhost:8000/app/bibilo/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, contraseña: password }),
            })

            const resultado = await response.json()

            if (!response.ok) {
                throw new Error(resultado.message || 'Error al iniciar sesión')
            }

            login(resultado.token, resultado.data)
            navigate('/perfil')
        } catch (error) {
            setErrorMensaje(error.message)
        } finally {
            setGuardando(false)
        }
    }

    return (
        <section className="library-page">
            <Link className="library-link library-link--secondary" to="/">
                Volver al inicio
            </Link>

            <h2 className="library-page__title">Iniciar sesión</h2>
            <p className="library-page__text">
                Acceda a su cuenta para gestionar la biblioteca.
            </p>

            <form className="library-form" onSubmit={handleSubmit}>
                <div className="library-form__row library-form__row--full">
                    <input
                        className="library-input"
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="library-form__row">
                    <input
                        className="library-input"
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {errorMensaje && (
                    <p style={{ color: 'red', fontWeight: 'bold', margin: '10px 0' }}>
                        {errorMensaje}
                    </p>
                )}

                <button className="library-button" type="submit" disabled={guardando}>
                    {guardando ? 'Entrando...' : 'Entrar'}
                </button>
            </form>

            <Link className="library-link library-link--secondary" to="/nuevo-usuario">
                ¿No tiene cuenta? Regístrese
            </Link>
        </section>
    )
}

export default Iniciar_sesion
