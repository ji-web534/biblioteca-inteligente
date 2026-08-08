import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { crearLibro } from '../fetch/libros'
import { obtenerCategorias } from '../fetch/categorias'

function NewBook() {
    const [titulo, setTitulo] = useState('')
    const [autor, setAutor] = useState('')
    const [editorial, setEditorial] = useState('')
    const [anio, setAnio] = useState('')
    const [isbn, setIsbn] = useState('')
    const [categoria, setCategoria] = useState('')
    const [categorias, setCategorias] = useState([])
    const [libros, setLibros] = useState([])
    const [guardando, setGuardando] = useState(false)

    useEffect(() => {
        let activo = true
        obtenerCategorias()
            .then((data) => {
                if (activo) setCategorias((data || []).filter((c) => c.activo))
            })
            .catch(() => {})
        return () => {
            activo = false
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!titulo.trim()) {
            alert('El título es obligatorio.')
            return
        }

        const descripcion = [
            autor && `Autor: ${autor.trim()}`,
            editorial && `Editorial: ${editorial.trim()}`,
            anio && `Año: ${anio.trim()}`,
            isbn && `ISBN: ${isbn.trim()}`,
        ]
            .filter(Boolean)
            .join(' | ')

        setGuardando(true)
        const genero = categorias.find((c) => c._id === categoria)?.nombre || ''
        const libroGuardado = await crearLibro(titulo.trim(), descripcion.trim(), genero)
        setGuardando(false)

        if (libroGuardado) {
            setLibros((prev) => [
                ...prev,
                {
                    titulo: libroGuardado.nombre ?? titulo.trim(),
                    autor: autor.trim(),
                    descripcion: libroGuardado.descripcion ?? descripcion,
                    genero: libroGuardado.genero ?? genero,
                },
            ])
            setTitulo('')
            setAutor('')
            setEditorial('')
            setAnio('')
            setIsbn('')
            setCategoria('')
        }
    }

    return (
        <section className="library-page">
            <Link className="library-link library-link--secondary" to="/">
                Volver al inicio
            </Link>

            <h2 className="library-page__title">Registro de nuevo libro</h2>
            <p className="library-page__text">
                Complete los campos para incorporar una obra al catálogo.
            </p>

            <form className="library-form" onSubmit={handleSubmit}>
                <div className="library-form__row library-form__row--full">
                    <input
                        className="library-input"
                        type="text"
                        placeholder="Título"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                    />
                </div>
                <div className="library-form__row">
                    <input
                        className="library-input"
                        type="text"
                        placeholder="Autor"
                        value={autor}
                        onChange={(e) => setAutor(e.target.value)}
                    />
                    <input
                        className="library-input"
                        type="text"
                        placeholder="Editorial"
                        value={editorial}
                        onChange={(e) => setEditorial(e.target.value)}
                    />
                </div>
                <div className="library-form__row">
                    <input
                        className="library-input"
                        type="text"
                        placeholder="Año"
                        value={anio}
                        onChange={(e) => setAnio(e.target.value)}
                    />
                    <input
                        className="library-input"
                        type="text"
                        placeholder="ISBN"
                        value={isbn}
                        onChange={(e) => setIsbn(e.target.value)}
                    />
                </div>
                <div className="library-form__row">
                    <select
                        className="library-input"
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                    >
                        <option value="">— Sin categoría —</option>
                        {categorias.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.nombre}
                            </option>
                        ))}
                    </select>
                    <div style={{ visibility: 'hidden', flex: 1 }}>
                        <input className="library-input" type="text" readOnly tabIndex={-1} />
                    </div>
                </div>
                <button className="library-button" type="submit" disabled={guardando}>
                    {guardando ? 'Guardando...' : 'Guardar'}
                </button>
            </form>

            <div className="library-table-wrap">
                <table className="library-table">
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Autor</th>
                            <th>Categoría</th>
                            <th>Descripción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {libros.map((libro, index) => (
                            <tr key={index}>
                                <td>{libro.titulo}</td>
                                <td>{libro.autor}</td>
                                <td>{libro.genero || '—'}</td>
                                <td>{libro.descripcion}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}

export default NewBook