import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { restablecerContraseña } from '../fetch/cuenta'

function Cambiar_contraseña() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const token = searchParams.get('token')

    const [nuevaContraseña, setNuevaContraseña] = useState('')
    const [confirmarContraseña, setConfirmarContraseña] = useState('')
    const [guardando, setGuardando] = useState(false)
    const [errorMensaje, setErrorMensaje] = useState('')
    const [exito, setExito] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMensaje('')

        if (nuevaContraseña !== confirmarContraseña) {
            setErrorMensaje('Las contraseñas no coinciden.')
            return
        }

        if (nuevaContraseña.length < 6) {
            setErrorMensaje('La contraseña debe tener al menos 6 caracteres.')
            return
        }

        setGuardando(true)
        try {
            await restablecerContraseña(token, nuevaContraseña)
            setExito(true)
        } catch (error) {
            setErrorMensaje(error.message)
        } finally {
            setGuardando(false)
        }
    }

    if (!token) {
        return (
            <section className="library-page">
                <Link className="library-link library-link--secondary" to="/">
                    Volver al inicio
                </Link>
                <h2 className="library-page__title">Enlace inválido</h2>
                <p className="library-page__text">
                    El enlace que usaste no es válido o está incompleto.
                </p>
            </section>
        )
    }

    if (exito) {
        return (
            <section className="library-page library-page--success">
                <h2 className="library-page__title">Contraseña actualizada</h2>
                <div className="library-success">
                    <p className="library-page__text" style={{ textAlign: 'center' }}>
                        Tu contraseña se restableció correctamente.
                    </p>
                    <div className="library-success__actions">
                        <Link className="library-link" to="/iniciar-sesion">
                            Iniciar sesión
                        </Link>
                        <Link className="library-link library-link--secondary" to="/">
                            Volver al inicio
                        </Link>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="library-page">
            <Link className="library-link library-link--secondary" to="/">
                Volver al inicio
            </Link>

            <h2 className="library-page__title">Restablecer contraseña</h2>
            <p className="library-page__text">
                Ingresá tu nueva contraseña.
            </p>

            <form className="library-form" onSubmit={handleSubmit} style={{ maxWidth: '420px', marginLeft: 0, marginRight: 'auto' }}>
                <div className="library-form__row library-form__row--full">
                    <input
                        className="library-input"
                        type="password"
                        placeholder="Nueva contraseña"
                        value={nuevaContraseña}
                        onChange={(e) => setNuevaContraseña(e.target.value)}
                        required
                        minLength={6}
                    />
                </div>
                <div className="library-form__row library-form__row--full">
                    <input
                        className="library-input"
                        type="password"
                        placeholder="Confirmar nueva contraseña"
                        value={confirmarContraseña}
                        onChange={(e) => setConfirmarContraseña(e.target.value)}
                        required
                        minLength={6}
                    />
                </div>

                {errorMensaje && (
                    <p style={{ color: 'red', fontWeight: 'bold', margin: '10px 0' }}>
                        {errorMensaje}
                    </p>
                )}

                <button className="library-button" type="submit" disabled={guardando}>
                    {guardando ? 'Guardando...' : 'Restablecer contraseña'}
                </button>
            </form>
        </section>
    )
}

export default Cambiar_contraseña
