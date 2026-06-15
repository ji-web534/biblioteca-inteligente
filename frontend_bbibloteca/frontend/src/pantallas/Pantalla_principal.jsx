import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Pantalla_principal() {
    const { estaAutenticado, usuario, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <section className="library-page">
            <h2 className="library-page__title">Pantalla principal</h2>

            {estaAutenticado ? (
                <p className="library-page__text">
                    Bienvenido, <strong>{usuario?.nombre}</strong>.
                </p>
            ) : (
                <p className="library-page__text">
                    Bienvenido al catálogo. Desde aquí puede consultar el archivo
                    y registrar nuevas obras en la colección.
                </p>
            )}

            <div className="library-page__actions" style={{ flexDirection: 'column', gap: '0.75rem', alignItems: 'stretch' }}>
                <Link className="library-link" to="/nuevo-libro">
                    Agregar nuevo libro
                </Link>

                {estaAutenticado ? (
                    <>
                        <Link className="library-link" to="/mis-libros">
                            Mis Libros
                        </Link>
                        <Link className="library-link" to="/favoritos">
                            Libros Favoritos
                        </Link>
                        <button
                            className="library-button"
                            onClick={handleLogout}
                            style={{ width: '100%', textAlign: 'center' }}
                        >
                            Cerrar sesión
                        </button>
                    </>
                ) : (
                    <>
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
                    </>
                )}
            </div>
        </section>
    )
}

export default Pantalla_principal
