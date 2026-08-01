import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { obtenerMisLibros, buscarLibros, removerLibro, eliminarLibro, restaurarLibro } from '../fetch/libros'
import { obtenerFavoritos, agregarFavorito, quitarFavorito } from '../fetch/fetch_favoritos'
import { useAuth } from '../context/AuthContext'

function Buscador() {
    const { estaAutenticado } = useAuth()
    const [consulta, setConsulta] = useState('')
    const [resultados, setResultados] = useState([])
    const [todosLibros, setTodosLibros] = useState([])
    const [favoritos, setFavoritos] = useState([])
    const [cargando, setCargando] = useState(true)
    const [buscando, setBuscando] = useState(false)
    const [busco, setBusco] = useState(false)
    const [errorCarga, setErrorCarga] = useState('')

    useEffect(() => {
        cargarDatos()
    }, [estaAutenticado])

    const cargarDatos = async () => {
        if (!estaAutenticado) {
            setCargando(false)
            return
        }
        try {
            const [libros, favs] = await Promise.all([
                obtenerMisLibros(),
                obtenerFavoritos()
            ])
            setTodosLibros(libros || [])
            setFavoritos(favs || [])
        } catch (error) {
            setErrorCarga(error.message || 'Error al cargar los datos.')
        } finally {
            setCargando(false)
        }
    }

    const handleBuscar = async (e) => {
        e.preventDefault()
        const termino = consulta.trim()
        if (!termino) {
            setResultados([])
            setBusco(false)
            return
        }
        setBuscando(true)
        setBusco(true)
        try {
            const libros = await buscarLibros(termino)
            setResultados(libros || [])
        } catch (error) {
            setResultados([])
        } finally {
            setBuscando(false)
        }
    }

    const esFavorito = (libroId) => (favoritos || []).some((f) => f._id === libroId)

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

    const handleRemoverLibro = async (libroId) => {
        const result = await removerLibro(libroId)
        if (result) {
            setResultados((prev) => prev.filter((l) => l._id !== libroId))
            setTodosLibros((prev) => prev.filter((l) => l._id !== libroId))
            alert(result.message)
        }
    }

    const handleEliminarLibro = async (libroId) => {
        const confirmar = window.confirm('¿Eliminar este libro permanentemente? Esta acción no se puede deshacer.')
        if (!confirmar) return
        const result = await eliminarLibro(libroId)
        if (result) {
            setResultados((prev) => prev.filter((l) => l._id !== libroId))
            setTodosLibros((prev) => prev.filter((l) => l._id !== libroId))
            alert(result.message)
        }
    }

    const handleRestaurarLibro = async (libroId) => {
        const result = await restaurarLibro(libroId)
        if (result) {
            alert(result.message)
            cargarLibros()
        }
    }

    return (
        <section className="library-page">
            <Link className="library-link library-link--secondary" to={estaAutenticado ? '/perfil' : '/'}>
                Volver
            </Link>

            <h2 className="library-page__title">Buscar libros</h2>
            <p className="library-page__text">Busca en el catálogo general.</p>

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

            {errorCarga && <p style={{ color: 'var(--ink-error, #c00)' }}>{errorCarga}</p>}

            {buscando && <p>Buscando...</p>}

            {resultados.length > 0 && (
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
                                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', marginRight: '0.25rem' }}
                                            onClick={() => handleToggleFavorito(libro._id)}
                                        >
                                            {esFavorito(libro._id) ? 'Quitar favorito' : 'Favorito'}
                                        </button>
                                        <button
                                            className="library-button"
                                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', marginRight: '0.25rem', background: 'var(--gold)', color: 'var(--ink)' }}
                                            onClick={() => handleRemoverLibro(libro._id)}
                                        >
                                            Remover
                                        </button>
                                        <button
                                            className="library-button"
                                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', background: 'var(--ink-error, #c00)', color: 'var(--parchment)' }}
                                            onClick={() => handleEliminarLibro(libro._id)}
                                        >
                                            Eliminar
                                        </button>
                                        <button
                                            className="library-button"
                                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', marginLeft: '0.25rem', background: 'var(--leather)', color: 'var(--parchment)' }}
                                            onClick={() => handleRestaurarLibro(libro._id)}
                                        >
                                            Restaurar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!buscando && busco && consulta.trim() && resultados.length === 0 && (
                <p style={{ fontStyle: 'italic', color: 'var(--ink-soft)', marginTop: '1rem' }}>
                    No se encontraron libros para "{consulta}".
                </p>
            )}
        </section>
    )
}

export default Buscador
