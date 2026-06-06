import { Link } from 'react-router-dom'

function Pantalla_principal() {
    return (
        <section className="library-page">
            <h2 className="library-page__title">Pantalla principal</h2>
            <p className="library-page__text">
                Bienvenido al catálogo. Desde aquí puede consultar el archivo
                y registrar nuevas obras en la colección.
            </p>
            <Link className="library-link" to="/nuevo-libro">
                Agregar nuevo libro
            </Link>
        </section>
    )
}

export default Pantalla_principal
