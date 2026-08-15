import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { obtenerLibroPorId } from '../fetch/libros'

const CATEGORIAS_MAP = {
    terror: 'Terror',
    fantasia: 'Fantasía',
    romance: 'Romance'
}

function BookDetail() {
    const { id } = useParams()
    console.log('ID recibido en BookDetail:', id)
    const [libro, setLibro] = useState(null)
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let activo = true
        const cargar = async () => {
            const data = await obtenerLibroPorId(id)
            console.log('Respuesta del fetch (data):', data)
            if (!activo) return
            if (data) {
                setLibro(data)
            } else {
                setError('No se pudo encontrar el libro.')
            }
            setCargando(false)
        }
        cargar()
        return () => {
            activo = false
        }
    }, [id])

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
                        <strong>{libro.nombre}</strong>
                    </p>
                    <p className="library-page__text">Autor: {libro.autor || 'Sin autor'}</p>
                    {libro.genero && <p className="library-page__text">Categoría: {CATEGORIAS_MAP[libro.genero] || libro.genero}</p>}
                    {libro.descripcion && (
                        <p className="library-page__text">{libro.descripcion}</p>
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
                </>
            ) : null}
        </section>
    )
}

export default BookDetail