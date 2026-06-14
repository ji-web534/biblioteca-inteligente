import { Link } from 'react-router-dom'

function Pantalla_principal() {
    return (
        <section className="library-page">
            <h2 className="library-page__title">Pantalla principal</h2>
            <p className="library-page__text">
                Bienvenido al catálogo. Desde aquí puede consultar el archivo
                y registrar nuevas obras en la colección.
            </p>
            <div className="library-page__actions">
                <Link className="library-link" to="/nuevo-libro">
                    Agregar nuevo libro
                </Link>
                <Link className="library-link" to="/iniciar-sesion">
                    Iniciar sesión
                </Link>
            </div>
            <div style={{ marginTop: '1rem' }}>
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
        </section>
    )
}

export default Pantalla_principal
