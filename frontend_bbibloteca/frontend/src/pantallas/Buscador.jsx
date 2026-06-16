import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { obtenerMisLibros } from '../fetch/fetch_libros'
import { obtenerFavoritos, agregarFavorito, quitarFavorito } from '../fetch/fetch_favoritos'
import { useAuth } from '../context/AuthContext'

function Buscador() {
    const { estaAutenticado } = useAuth()
    const [consulta, setConsulta] = useState('')
    const [resultados, setResultados] = useState([])
    const [todosLibros, setTodosLibros] = useState([])
    const [favoritos, setFavoritos] = useState([])
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        if (!estaAutenticado) return
        cargarDatos()
    }, [estaAutenticado])

    const cargarDatos = async () => {
        try {
            const [libros, favs] = await Promise.all([
                obtenerMisLibros(),
                obtenerFavoritos()
            ])
            setTodosLibros(libros)
            setFavoritos(favs)
        } catch (error) {
            console.error(error.message)
        } finally {
            setCargando(false)
        }
    }

    const handleBuscar = (e) => {
        e.preventDefault()
        const termino = consulta.toLowerCase().trim()
        if (!termino) {
            setResultados([])
            return
        }
        const filtrados = todosLibros.filter(
            (libro) =>
                libro.nombre.toLowerCase().includes(termino) ||
                libro.descripcion.toLowerCase().includes(termino)
        )
        setResultados(filtrados)
    }

    const esFavorito = (libroId) => favoritos.some((f) => f._id === libroId)

    const handleToggleFavorito = async (libroId) => {
        if (esFavorito(libroId)) {
            const result = await quitarFavorito(libroId)
            if (result) setFavoritos((prev) => prev.filter((l) => l._id !== libroId))
        } else {
            const result = await agregarFavorito(libroId)
            if (result) {
                const libro = todosLibros.find((l) => l._id === libroId)
                if (libro) setFavoritos((prev) => [...prev, libro])
            }
        }
    }

    return (
        <section className="library-page">
            <Link className="library-link library-link--secondary" to={estaAutenticado ? '/perfil' : '/'}>
                Volver
            </Link>

            <h2 className="library-page__title">Buscar libros</h2>
            <p className="library-page__text">Busca en tu catálogo personal.</p>

            <form className="library-form" onSubmit={handleBuscar}>
                <div className="library-form__row library-form__row--full">
                    <input
                        className="library-input"
                        type="text"
                        placeholder="Buscar por título o descripción..."
                        value={consulta}
                        onChange={(e) => setConsulta(e.target.value)}
                    />
                </div>
                <button className="library-button" type="submit">Buscar</button>
            </form>

            {cargando && <p>Cargando catálogo...</p>}

            {!cargando && resultados.length > 0 && (
                <div className="library-table-wrap" style={{ marginTop: '1.5rem' }}>
                    <table className="library-table">
                        <thead>
                            <tr>
                                <th>Título</th>
                                <th>Descripción</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultados.map((libro) => (
                                <tr key={libro._id}>
                                    <td>{libro.nombre}</td>
                                    <td style={{ fontSize: '0.85rem' }}>{libro.descripcion}</td>
                                    <td>
                                        <button
                                            className="library-button"
                                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                                            onClick={() => handleToggleFavorito(libro._id)}
                                        >
                                            {esFavorito(libro._id) ? 'Quitar favorito' : 'Favorito'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!cargando && consulta.trim() && resultados.length === 0 && (
                <p style={{ fontStyle: 'italic', color: 'var(--ink-soft)', marginTop: '1rem' }}>
                    No se encontraron libros para "{consulta}".
                </p>
            )}
        </section>
    )
}

export default Buscador
