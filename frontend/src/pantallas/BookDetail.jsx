import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { obtenerLibroPorId } from '../fetch/libros'
import { obtenerComentarios, crearComentario, eliminarComentario } from '../fetch/comentarios'
import { useAuth } from '../context/AuthContext'

const CATEGORIAS_MAP = {
    terror: 'Terror',
    fantasia: 'Fantasía',
    romance: 'Romance'
}

function BookDetail() {
    const { id } = useParams()
    const { usuario, estaAutenticado } = useAuth()
    const [libro, setLibro] = useState(null)
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')
    const [comentarios, setComentarios] = useState([])
    const [textoComentario, setTextoComentario] = useState('')
    const [enviando, setEnviando] = useState(false)

    useEffect(() => {
        let activo = true
        const cargar = async () => {
            const data = await obtenerLibroPorId(id)
            const todas = []
            let pagina = 1
            // eslint-disable-next-line no-constant-condition
            while (true) {
                const res = await obtenerComentarios(id, pagina)
                if (!res.data || res.data.length === 0) break
                todas.push(...res.data)
                if (todas.length >= res.pagination.total) break
                pagina++
            }
            if (!activo) return
            if (data) {
                setLibro(data)
            } else {
                setError('No se pudo encontrar el libro.')
            }
            setComentarios(todas)
            setCargando(false)
        }
        cargar()
        return () => {
            activo = false
        }
    }, [id])

    const handleEnviarComentario = async (e) => {
        e.preventDefault()
        if (!textoComentario.trim()) return
        setEnviando(true)
        const nuevo = await crearComentario(id, textoComentario)
        if (nuevo) {
            setComentarios((prev) => [nuevo, ...prev])
            setTextoComentario('')
        }
        setEnviando(false)
    }

    const handleEliminarComentario = async (comentarioId) => {
        const resultado = await eliminarComentario(comentarioId)
        if (resultado?.ok) {
            setComentarios((prev) => prev.filter((c) => c._id !== comentarioId))
        }
    }

    return (
        <section className="library-page">
            <Link className="library-link library-link--secondary" to="/buscador">
                Volver
            </Link>

            <h2 className="library-page__title">Detalle del libro</h2>

            {cargando ? (
                <p>Cargando...</p>
            ) : error ? (
                <p style={{ fontStyle: 'italic', color: 'var(--ink-error, #c00)' }}>{error}</p>
            ) : libro ? (
                <>
                    <p className="library-page__text">
                        <strong>Título:</strong> {libro.nombre}
                    </p>
                    <p className="library-page__text">
                        <strong>Autor:</strong> {libro.autor || 'Sin autor'}
                    </p>
                    {libro.genero && (
                        <p className="library-page__text">
                            <strong>Categoría:</strong> {CATEGORIAS_MAP[libro.genero] || libro.genero}
                        </p>
                    )}
                    {libro.descripcion && (
                        <p className="library-page__text">
                            <strong>Descripción:</strong> {libro.descripcion}
                        </p>
                    )}

                    {libro.texto ? (
                        <div
                            className="library-book-content"
                            style={{
                                marginTop: '1.5rem',
                                padding: '1.5rem',
                                background: 'rgba(255,252,246,0.5)',
                                border: '1px solid var(--border)',
                                borderRadius: '4px',
                            }}
                        >
                            {libro.texto}
                        </div>
                    ) : (
                        <p style={{ fontStyle: 'italic', color: 'var(--ink-soft)', marginTop: '1.5rem' }}>
                            Este libro no tiene texto cargado.
                        </p>
                    )}

                    <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                        <h3 className="library-page__title">Comentarios ({comentarios.length})</h3>

                        {estaAutenticado ? (
                            <form className="library-form" onSubmit={handleEnviarComentario}>
                                <div className="library-form__row library-form__row--full">
                                    <textarea
                                        className="library-input"
                                        placeholder="Escribe un comentario..."
                                        value={textoComentario}
                                        onChange={(e) => setTextoComentario(e.target.value)}
                                        maxLength={500}
                                        rows={3}
                                        required
                                    />
                                </div>
                                <button className="library-button" type="submit" disabled={enviando}>
                                    {enviando ? 'Publicando...' : 'Publicar comentario'}
                                </button>
                            </form>
                        ) : (
                            <p className="library-page__text">
                                <Link className="library-link" to="/iniciar-sesion">Inicia sesión</Link> para comentar.
                            </p>
                        )}

                        {comentarios.length === 0 ? (
                            <p style={{ fontStyle: 'italic', color: 'var(--ink-soft)', marginTop: '1rem' }}>
                                Aún no hay comentarios.
                            </p>
                        ) : (
                            <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0 0' }}>
                                {comentarios.map((c) => (
                                    <li
                                        key={c._id}
                                        style={{
                                            padding: '0.75rem 0',
                                            borderBottom: '1px solid var(--border)'
                                        }}
                                    >
                                        <p style={{ margin: 0 }}>
                                            <strong>{c.usuarioId?.nombre || 'Usuario'}</strong>
                                            <span style={{ color: 'var(--ink-soft)', marginLeft: '0.5rem', fontSize: '0.85rem' }}>
                                                {new Date(c.createdAt).toLocaleDateString()}
                                            </span>
                                        </p>
                                        <p style={{ margin: '0.25rem 0 0' }}>{c.texto}</p>
                                        {(usuario?._id === c.usuarioId?._id || usuario?.role === 'admin' || usuario?.role === 'moderator') && (
                                            <button
                                                className="library-link library-link--secondary"
                                                type="button"
                                                onClick={() => handleEliminarComentario(c._id)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                            >
                                                Eliminar
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </>
            ) : null}
        </section>
    )
}

export default BookDetail