import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { obtenerMisLibros } from '../fetch/fetch_libros'
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
                                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                                            onClick={() => handleAgregarFavorito(libro._id)}
                                        >
                                            Favorito
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
