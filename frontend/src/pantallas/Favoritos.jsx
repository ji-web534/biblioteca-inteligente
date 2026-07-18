import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { obtenerFavoritos, quitarFavorito } from '../fetch/fetch_favoritos'
import { useAuth } from '../context/AuthContext'

function Favoritos() {
    const { estaAutenticado } = useAuth()
    const navigate = useNavigate()
    const [favoritos, setFavoritos] = useState([])
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        if (!estaAutenticado) {
            navigate('/iniciar-sesion')
            return
        }
        cargarFavoritos()
    }, [estaAutenticado])

    const cargarFavoritos = async () => {
        try {
            const data = await obtenerFavoritos()
            setFavoritos(data)
        } catch (error) {
            alert(error.message)
        } finally {
            setCargando(false)
        }
    }

    const handleQuitarFavorito = async (libroId) => {
        const result = await quitarFavorito(libroId)
        if (result) {
            setFavoritos((prev) => prev.filter((libro) => libro._id !== libroId))
        }
    }

    if (cargando) return <section className="library-page"><p>Cargando...</p></section>

    return (
        <section className="library-page">
            <Link className="library-link library-link--secondary" to="/">Volver al inicio</Link>
            <h2 className="library-page__title">Libros Favoritos</h2>
            <p className="library-page__text">Tus libros favoritos guardados.</p>

            {favoritos.length === 0 ? (
                <p>No tienes libros favoritos aún.</p>
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
                            {favoritos.map((libro) => (
                                <tr key={libro._id}>
                                    <td>{libro.nombre}</td>
                                    <td>{libro.descripcion}</td>
                                    <td>
                                        <button
                                            className="library-button"
                                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                                            onClick={() => handleQuitarFavorito(libro._id)}
                                        >
                                            Quitar
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

export default Favoritos
