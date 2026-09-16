import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { reenviarVerificacion } from '../fetch/auth'

function Login() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [guardando, setGuardando] = useState(false)
    const [errorMensaje, setErrorMensaje] = useState('')
    const [reenviando, setReenviando] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMensaje('')
        setGuardando(true)

        try {
            await login(email, password)
            navigate('/perfil')
        } catch (error) {
            setErrorMensaje(error.message)
        } finally {
            setGuardando(false)
        }
    }

    const handleReenviar = async () => {
        if (!email) {
            setErrorMensaje('Ingresa tu correo electrónico para reenviar la verificación.')
            return
        }
        setReenviando(true)
        setErrorMensaje('')
        try {
            await reenviarVerificacion(email)
            setErrorMensaje('Si el correo existe y no está verificado, recibirás un nuevo enlace de confirmación.')
        } catch (error) {
            setErrorMensaje(error.message)
        } finally {
            setReenviando(false)
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

            <button
                className="library-link library-link--secondary"
                type="button"
                onClick={handleReenviar}
                disabled={reenviando}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
                {reenviando ? 'Reenviando...' : '¿No recibiste el correo de verificación? Reenviar'}
            </button>

            <Link className="library-link library-link--secondary" to="/nuevo-usuario">
                ¿No tiene cuenta? Regístrese
            </Link>
        </section>
    )
}

export default Login
