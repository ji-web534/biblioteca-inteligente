import { useEffect, useState } from 'react'
import { obtenerFavoritos, quitarFavorito } from '../../fetch/favorites'

function Favoritos() {
    const [favoritos, setFavoritos] = useState([])
    const [cargandoFavs, setCargandoFavs] = useState(true)

    useEffect(() => {
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
        cargarFavoritos()
    }, [])

    const handleQuitarFavorito = async (libroId) => {
        const result = await quitarFavorito(libroId)
        if (result) {
            setFavoritos((prev) => prev.filter((l) => l._id !== libroId))
        }
    }

    return (
        <div>
            <h3 className="library-page__title" style={{ fontSize: '1.1rem' }}>Favoritos</h3>
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
    )
}

export default Favoritos