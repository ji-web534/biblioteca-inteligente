import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { obtenerFeedComentarios } from '../fetch/comentarios'

function Feed() {
    const [comentarios, setComentarios] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let activo = true
        const cargar = async () => {
            const res = await obtenerFeedComentarios(1, 20)
            if (!activo) return
            setComentarios(res.data || [])
            if (!res.data || res.data.length === 0) {
                setError('Todavía no hay actividad en tu feed.')
            }
            setCargando(false)
        }
        cargar()
        return () => {
            activo = false
        }
    }, [])

    return (
        <section className="library-page">
            <h2 className="library-page__title">Mi Feed</h2>
            <p className="library-page__text">
                Actividad reciente de la comunidad.
            </p>

            {cargando ? (
                <p>Cargando...</p>
            ) : error ? (
                <p style={{ fontStyle: 'italic', color: 'var(--ink-soft)' }}>{error}</p>
            ) : commentList()}
        </section>
    )

    function commentList() {
        return (
            <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0 0' }}>
                {comentarios.map((c) => (
                    <li key={c._id} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                        <p style={{ margin: 0 }}>
                            <strong>{c.usuarioId?.nombre || 'Usuario'}</strong>
                            <span style={{ color: 'var(--ink-soft)', marginLeft: '0.5rem', fontSize: '0.85rem' }}>
                                {new Date(c.createdAt).toLocaleDateString()}
                            </span>
                        </p>
                        <p style={{ margin: '0.25rem 0 0' }}>{c.texto}</p>
                        {c.libroId && (
                            <Link className="library-link" to={`/libro/${c.libroId._id}`} style={{ fontSize: '0.85rem' }}>
                                En {c.libroId.nombre}
                            </Link>
                        )}
                    </li>
                ))}
            </ul>
        )
    }
}

export default Feed