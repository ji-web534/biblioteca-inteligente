import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { obtenerMisLibros, removerLibro, eliminarLibro, restaurarLibro } from '../fetch/libros'
import { agregarFavorito } from '../fetch/fetch_favoritos'
import { useAuth } from '../context/AuthContext'

function MisLibros() {
    const { estaAutenticado } = useAuth()
    const navigate = useNavigate()
    const [libros, setLibros] = useState([])
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
         if (!estaAutenticado) {
            navigate('/iniciar-sesion')
            return
        }
        cargarLibros()
    }, [estaAutenticado])

    const cargarLibros = async () => {
        try {
            const data = await obtenerMisLibros()
            setLibros(data)
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
            alert(result.message)
        }
    }

    const handleEliminarLibro = async (libroId) => {
        const confirmar = window.confirm('¿Eliminar este libro permanentemente? Esta acción no se puede deshacer.')
        if (!confirmar) return
        const result = await eliminarLibro(libroId)
        if (result) {
            setLibros((prev) => prev.filter((l) => l._id !== libroId))
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
                                        <button
                                            className="library-button"
                                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', marginRight: '0.5rem', background: 'var(--gold)', color: 'var(--ink)' }}
                                            onClick={() => handleRemoverLibro(libro._id)}
                                        >
                                            Remover libro
                                        </button>
                                        <button
                                            className="library-button"
                                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', background: 'var(--ink-error, #c00)', color: 'var(--parchment)' }}
                                            onClick={() => handleEliminarLibro(libro._id)}
                                        >
                                            Eliminar libro
                                        </button>
                                        <button
                                            className="library-button"
                                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', marginLeft: '0.5rem', background: 'var(--leather)', color: 'var(--parchment)' }}
                                            onClick={() => handleRestaurarLibro(libro._id)}
                                        >
                                            Restaurar libro
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    )
}

export default MisLibros
