import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { obtenerMisLibros, removerLibro, eliminarLibro, restaurarLibro } from '../fetch/libros'
import { obtenerFavoritos, agregarFavorito, quitarFavorito } from '../fetch/fetch_favoritos'

function Perfil() {
    const { usuario, estaAutenticado, logout } = useAuth()
    const navigate = useNavigate()
    const [libros, setLibros] = useState([])
    const [favoritos, setFavoritos] = useState([])
    const [cargandoLibros, setCargandoLibros] = useState(true)
    const [cargandoFavs, setCargandoFavs] = useState(true)

    useEffect(() => {
        if (!estaAutenticado) {
            navigate('/iniciar-sesion')
            return
        }
        cargarLibros()
        cargarFavoritos()
    }, [estaAutenticado])

    const cargarLibros = async () => {
        try {
            const data = await obtenerMisLibros()
            setLibros(data || [])
        } catch (error) {
            console.error(error.message)
            setLibros([])
        } finally {
            setCargandoLibros(false)
        }
    }

    const cargarFavoritos = async () => {
        try {
            const data = await obtenerFavoritos()
            setFavoritos(data || [])
        } catch (error) {
            console.error(error.message)
            setFavoritos([])
        } finally {
            setCargandoFavs(false)
        }
    }

    const handleAgregarFavorito = async (libroId) => {
        const result = await agregarFavorito(libroId)
        if (result) {
            const libro = libros.find((l) => l._id === libroId)
            if (libro) setFavoritos((prev) => [...prev, libro])
        }
    }

    const handleQuitarFavorito = async (libroId) => {
        const result = await quitarFavorito(libroId)
        if (result) {
            setFavoritos((prev) => prev.filter((l) => l._id !== libroId))
        }
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

    const esFavorito = (libroId) => (favoritos || []).some((f) => f._id === libroId)

    if (!estaAutenticado) return null

    return (
        <section className="library-page">
            <Link className="library-link library-link--secondary" to="/">Volver al inicio</Link>

            <div style={{ textAlign: 'center', marginBottom: '2rem', padding: '1.5rem', background: 'rgba(255,252,246,0.5)', border: '1px solid var(--border)' }}>
                <h2 className="library-page__title" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                    {usuario?.nombre}
                </h2>
                <p style={{ color: 'var(--ink-soft)', fontStyle: 'italic', margin: '0 0 0.5rem' }}>
                    {usuario?.email}
                </p>
                <span style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    borderRadius: '4px',
                    background: usuario?.role === 'admin' ? 'var(--leather)' : usuario?.role === 'moderator' ? 'var(--gold)' : 'var(--border)',
                    color: usuario?.role === 'user' ? 'var(--ink)' : 'var(--parchment)'
                }}>
                    {usuario?.role || 'user'}
                </span>
            </div>

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                <Link className="library-link" to="/nuevo-libro" style={{ flex: 1, textAlign: 'center' }}>Agregar libro</Link>
                <Link className="library-link" to="/buscador" style={{ flex: 1, textAlign: 'center' }}>Buscar libros</Link>
                <button className="library-button" onClick={() => { logout(); navigate('/') }} style={{ flex: 1, textAlign: 'center' }}>
                    Cerrar sesión
                </button>
            </div>

            <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                <div>
                    <h3 className="library-page__title" style={{ fontSize: '1.3rem' }}>Mis Libros</h3>
                    <p className="library-page__text" style={{ fontSize: '0.9rem' }}>Libros que has creado ({libros.length})</p>
                    {cargandoLibros ? <p>Cargando...</p> : libros.length === 0 ? (
                        <p style={{ fontStyle: 'italic', color: 'var(--ink-soft)' }}>Aún no has creado ningún libro.</p>
                    ) : (
                        <div className="library-table-wrap">
                            <table className="library-table">
                                <thead>
                                    <tr><th>Título</th><th>Descripción</th><th></th></tr>
                                </thead>
                                <tbody>
                                    {libros.map((libro) => (
                                        <tr key={libro._id}>
                                            <td>{libro.nombre}</td>
                                            <td style={{ fontSize: '0.85rem' }}>{libro.descripcion}</td>
                                            <td>
                                        {esFavorito(libro._id) ? (
                                            <button className="library-button" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', marginRight: '0.25rem' }} onClick={() => handleQuitarFavorito(libro._id)}>
                                                Quitar favorito
                                            </button>
                                        ) : (
                                            <button className="library-button" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', marginRight: '0.25rem' }} onClick={() => handleAgregarFavorito(libro._id)}>
                                                Favorito
                                            </button>
                                        )}
                                        <button
                                            className="library-button"
                                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', marginRight: '0.25rem', background: 'var(--gold)', color: 'var(--ink)' }}
                                            onClick={() => handleRemoverLibro(libro._id)}
                                        >
                                            Remover libro
                                        </button>
                                        <button
                                            className="library-button"
                                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', background: 'var(--ink-error, #c00)', color: 'var(--parchment)' }}
                                            onClick={() => handleEliminarLibro(libro._id)}
                                        >
                                            Eliminar libro
                                        </button>
                                        <button
                                            className="library-button"
                                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', marginLeft: '0.25rem', background: 'var(--leather)', color: 'var(--parchment)' }}
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
                </div>

                <div>
                    <h3 className="library-page__title" style={{ fontSize: '1.3rem' }}>Favoritos</h3>
                    <p className="library-page__text" style={{ fontSize: '0.9rem' }}>Tus libros favoritos ({favoritos.length})</p>
                    {cargandoFavs ? <p>Cargando...</p> : favoritos.length === 0 ? (
                        <p style={{ fontStyle: 'italic', color: 'var(--ink-soft)' }}>No tienes libros favoritos aún.</p>
                    ) : (
                        <div className="library-table-wrap">
                            <table className="library-table">
                                <thead>
                                    <tr><th>Título</th><th>Descripción</th><th></th></tr>
                                </thead>
                                <tbody>
                                    {favoritos.map((libro) => (
                                        <tr key={libro._id}>
                                            <td>{libro.nombre}</td>
                                            <td style={{ fontSize: '0.85rem' }}>{libro.descripcion}</td>
                                            <td>
                                                <button className="library-button" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={() => handleQuitarFavorito(libro._id)}>
                                                    Quitar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default Perfil
