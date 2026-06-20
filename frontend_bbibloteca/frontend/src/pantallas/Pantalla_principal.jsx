import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { solicitarCambioContraseña } from '../fetch/fetch_cambio_contraseña'

function Pantalla_principal() {
    const { estaAutenticado, usuario } = useAuth()
    const [mailEnviado, setMailEnviado] = useState(false)
    const [mailCargando, setMailCargando] = useState(false)
    const [mailError, setMailError] = useState('')

    const handleEnviarMail = async () => {
        setMailCargando(true)
        setMailError('')
        setMailEnviado(false)
        try {
            await solicitarCambioContraseña(usuario.email)
            setMailEnviado(true)
        } catch (error) {
            setMailError(error.message)
        } finally {
            setMailCargando(false)
        }
    }

    return (
        <section className="library-page">
            <h2 className="library-page__title">Pantalla principal</h2>

            {estaAutenticado ? (
                <>
                    <p className="library-page__text">
                        Bienvenido, <strong>{usuario?.nombre}</strong>.
                    </p>
                    <div className="library-page__actions" style={{ flexDirection: 'column', gap: '0.75rem', alignItems: 'stretch' }}>
                        <Link className="library-link" to="/nuevo-libro">
                            Agregar nuevo libro
                        </Link>
                        <Link className="library-link" to="/perfil">
                            Mi Perfil
                        </Link>
                        <Link className="library-link" to="/buscador">
                            Buscar libros
                        </Link>

                        <button
                            className="library-button"
                            onClick={handleEnviarMail}
                            disabled={mailCargando}
                            style={{ width: '100%' }}
                        >
                            {mailCargando ? 'Enviando...' : 'Cambiar contraseña'}
                        </button>

                        {mailEnviado && (
                            <p style={{ color: 'var(--leather)', fontWeight: 600, margin: 0 }}>
                                Revisá tu correo electrónico para continuar con el cambio de contraseña.
                            </p>
                        )}
                        {mailError && (
                            <p style={{ color: 'red', fontWeight: 600, margin: 0 }}>
                                {mailError}
                            </p>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <p className="library-page__text">
                        Bienvenido al catálogo. Desde aquí puede consultar el archivo
                        y registrar nuevas obras en la colección.
                    </p>
                    <div className="library-page__actions" style={{ flexDirection: 'column', gap: '0.75rem', alignItems: 'stretch' }}>
                        <Link className="library-link" to="/iniciar-sesion">
                            Iniciar sesión
                        </Link>
                        <div style={{ marginTop: '0.5rem' }}>
                            <Link
                                to="/nuevo-usuario"
                                style={{
                                    color: 'var(--leather-dark)',
                                    textDecoration: 'underline',
                                    fontStyle: 'italic',
                                    fontSize: '0.95rem',
                                }}
                            >
                                ¿No tiene cuenta? Regístrese
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </section>
    )
}

export default Pantalla_principal
