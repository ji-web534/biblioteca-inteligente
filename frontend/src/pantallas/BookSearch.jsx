import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { obtenerMisLibros, buscarLibros, removerLibro, eliminarLibro, restaurarLibro } from '../fetch/libros'
import { obtenerFavoritos, agregarFavorito, quitarFavorito } from '../fetch/favorites'
import { useAuth } from '../context/AuthContext'
import ActionMenu from '../components/ActionMenu'

function BookSearch() {
    const { estaAutenticado } = useAuth()
    const [consulta, setConsulta] = useState('')
    const [filtroGenero, setFiltroGenero] = useState('')
    const [filtroAutor, setFiltroAutor] = useState('')
    const [filtroDesde, setFiltroDesde] = useState('')
    const [filtroHasta, setFiltroHasta] = useState('')
    const [resultados, setResultados] = useState([])
    const [todosLibros, setTodosLibros] = useState([])
    const [favoritos, setFavoritos] = useState([])
    const [cargando, setCargando] = useState(true)
    const [buscando, setBuscando] = useState(false)
    const [busco, setBusco] = useState(false)
    const [errorCarga, setErrorCarga] = useState('')
    const [paginaActual, setPaginaActual] = useState(1)
    const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 })

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
                obtenerMisLibros().then((r) => r?.data || []),
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
        const filtros = {
            genero: filtroGenero.trim(),
            autor: filtroAutor.trim(),
            desde: filtroDesde,
            hasta: filtroHasta
        }
        if (!termino && !filtros.genero && !filtros.autor && !filtros.desde && !filtros.hasta) {
            setResultados([])
            setBusco(false)
            return
        }
        setBuscando(true)
        setBusco(true)
        setPaginaActual(1)
        try {
            const resultado = await buscarLibros(termino, filtros, 1)
            setResultados(resultado.data || [])
            setPagination(resultado.pagination || { page: 1, limit: 20, total: 0, totalPages: 1 })
        } catch (error) {
            setResultados([])
        } finally {
            setBuscando(false)
        }
    }

    const handleCambiarPagina = async (nuevaPagina) => {
        if (nuevaPagina < 1 || nuevaPagina > pagination.totalPages) return
        const termino = consulta.trim()
        const filtros = {
            genero: filtroGenero.trim(),
            autor: filtroAutor.trim(),
            desde: filtroDesde,
            hasta: filtroHasta
        }
        setBuscando(true)
        setPaginaActual(nuevaPagina)
        try {
            const resultado = await buscarLibros(termino, filtros, nuevaPagina)
            setResultados(resultado.data || [])
            setPagination(resultado.pagination || { page: 1, limit: 20, total: 0, totalPages: 1 })
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
        }
    }

    const handleEliminarLibro = async (libroId) => {
        const result = await eliminarLibro(libroId)
        if (result) {
            setResultados((prev) => prev.filter((l) => l._id !== libroId))
            setTodosLibros((prev) => prev.filter((l) => l._id !== libroId))
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

                <div className="library-form__row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem' }}>
                    <input
                        className="library-input"
                        type="text"
                        placeholder="Género"
                        value={filtroGenero}
                        onChange={(e) => setFiltroGenero(e.target.value)}
                    />
                    <input
                        className="library-input"
                        type="text"
                        placeholder="Autor"
                        value={filtroAutor}
                        onChange={(e) => setFiltroAutor(e.target.value)}
                    />
                </div>

                <div className="library-form__row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem' }}>
                    <label className="library-input-label">
                        Desde:
                        <input
                            className="library-input"
                            type="date"
                            value={filtroDesde}
                            onChange={(e) => setFiltroDesde(e.target.value)}
                        />
                    </label>
                    <label className="library-input-label">
                        Hasta:
                        <input
                            className="library-input"
                            type="date"
                            value={filtroHasta}
                            onChange={(e) => setFiltroHasta(e.target.value)}
                        />
                    </label>
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
                                        <ActionMenu opciones={[
                                            { etiqueta: 'Remover libro', accion: () => handleRemoverLibro(libro._id) },
                                            { etiqueta: 'Eliminar libro', accion: () => handleEliminarLibro(libro._id) },
                                            { etiqueta: 'Restaurar libro', accion: () => handleRestaurarLibro(libro._id) },
                                        ]} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {resultados.length > 0 && (
                <div className="library-pagination">
                    <button
                        className="library-button library-button--outline"
                        style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem' }}
                        disabled={paginaActual <= 1}
                        onClick={() => handleCambiarPagina(paginaActual - 1)}
                    >
                        Anterior
                    </button>
                    <span style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
                        Página {paginaActual} de {pagination.totalPages} ({pagination.total} resultados)
                    </span>
                    <button
                        className="library-button library-button--outline"
                        style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem' }}
                        disabled={paginaActual >= pagination.totalPages}
                        onClick={() => handleCambiarPagina(paginaActual + 1)}
                    >
                        Siguiente
                    </button>
                </div>
            )}

            {!buscando && busco && resultados.length === 0 && (consulta.trim() || filtroGenero || filtroAutor || filtroDesde || filtroHasta) && (
                <p style={{ fontStyle: 'italic', color: 'var(--ink-soft)', marginTop: '1rem' }}>
                    No se encontraron libros que coincidan con la búsqueda.
                </p>
            )}
        </section>
    )
}

export default BookSearch
