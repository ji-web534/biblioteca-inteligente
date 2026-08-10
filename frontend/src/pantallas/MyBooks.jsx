import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { obtenerMisLibros, removerLibro, eliminarLibro, restaurarLibro } from '../fetch/libros'
import { agregarFavorito } from '../fetch/favorites'
import { useAuth } from '../context/AuthContext'
import ActionMenu from '../components/ActionMenu'

function MyBooks() {
    const { estaAutenticado } = useAuth()
    const navigate = useNavigate()
    const [libros, setLibros] = useState([])
    const [cargando, setCargando] = useState(true)
    const [paginaActual, setPaginaActual] = useState(1)
    const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 })

    useEffect(() => {
         if (!estaAutenticado) {
            navigate('/iniciar-sesion')
            return
        }
        cargarLibros()
    }, [estaAutenticado])

    const cargarLibros = async () => {
        try {
            const resultado = await obtenerMisLibros(paginaActual)
            setLibros(resultado.data || [])
            setPagination(resultado.pagination || { page: 1, limit: 20, total: 0, totalPages: 1 })
        } catch (error) {
            alert(error.message)
        } finally {
            setCargando(false)
        }
    }

    const handleAgregarFavorito = async (libroId) => {
        const result = await agregarFavorito(libroId)
        if (result) alert(result.message)
    }

    const handleRemoverLibro = async (libroId) => {
        const result = await removerLibro(libroId)
        if (result) {
            setLibros((prev) => prev.filter((l) => l._id !== libroId))
        }
    }

    const handleEliminarLibro = async (libroId) => {
        const result = await eliminarLibro(libroId)
        if (result) {
            setLibros((prev) => prev.filter((l) => l._id !== libroId))
        }
    }

    const handleRestaurarLibro = async (libroId) => {
        const result = await restaurarLibro(libroId)
        if (result) {
            alert(result.message)
            cargarLibros()
        }
    }

    if (cargando) return <section className="library-page"><p>Cargando...</p></section>

    return (
        <section className="library-page">
            <Link className="library-link library-link--secondary" to="/">Volver al inicio</Link>
            <h2 className="library-page__title">Mis Libros</h2>
            <p className="library-page__text">Libros que has creado.</p>

            {libros.length === 0 ? (
                <p>No has creado ningún libro aún.</p>
            ) : (
                <div className="library-table-wrap">
                    <table className="library-table">
                        <thead>
                            <tr>
                                <th>Título</th>
                                <th>Descripción</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {libros.map((libro) => (
                                <tr key={libro._id}>
                                    <td>{libro.nombre}</td>
                                    <td>{libro.descripcion}</td>
                                    <td>
                                        <ActionMenu opciones={[
                                            { etiqueta: 'Ver libro', accion: () => navigate(`/libro/${libro._id}`) },
                                            { etiqueta: 'Agregar a favoritos', accion: () => handleAgregarFavorito(libro._id) },
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

            {libros.length > 0 && (
                <div className="library-pagination">
                    <button
                        className="library-button library-button--outline"
                        style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem' }}
                        disabled={paginaActual <= 1}
                        onClick={() => setPaginaActual((p) => p - 1)}
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
                        onClick={() => setPaginaActual((p) => p + 1)}
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </section>
    )
}

export default MyBooks
