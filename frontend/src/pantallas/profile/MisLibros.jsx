import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { obtenerMisLibros, removerLibro, eliminarLibro, restaurarLibro } from '../../fetch/libros'
import { obtenerFavoritos, agregarFavorito, quitarFavorito } from '../../fetch/favorites'
import ActionMenu from '../../components/ActionMenu'

function MisLibros() {
    const navigate = useNavigate()
    const [libros, setLibros] = useState([])
    const [favoritos, setFavoritos] = useState([])
    const [cargandoLibros, setCargandoLibros] = useState(true)
    const [cargandoFavs, setCargandoFavs] = useState(true)

    useEffect(() => {
        cargarLibros()
        cargarFavoritos()
    }, [])

    const cargarLibros = async () => {
        try {
            const resultado = await obtenerMisLibros()
            setLibros(resultado?.data || [])
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

    const esFavorito = (libroId) => (favoritos || []).some((f) => f._id === libroId)

    return (
        <div>
            <h3 className="library-page__title" style={{ fontSize: '1.1rem' }}>Mis Libros</h3>
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
                                        <ActionMenu opciones={[
                                            { etiqueta: 'Ver libro', accion: () => navigate(`/libro/${libro._id}`) },
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
        </div>
    )
}

export default MisLibros