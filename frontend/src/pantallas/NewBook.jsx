import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { crearLibro } from '../fetch/libros'
import { obtenerCategorias } from '../fetch/categorias'

const MAX_DESCRIPCION = 50
const MAX_TEXTO = 150

function NewBook() {
    const [titulo, setTitulo] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [texto, setTexto] = useState('')
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

        const descripcionTrim = descripcion.trim()
        const textoTrim = texto.trim()
        if (descripcionTrim.length > MAX_DESCRIPCION) return
        if (textoTrim.length > MAX_TEXTO) return

        setGuardando(true)
        const genero = categorias.find((c) => c._id === categoria)?.nombre || ''
        const libroGuardado = await crearLibro(titulo.trim(), descripcionTrim, textoTrim, genero)
        setGuardando(false)

        if (libroGuardado) {
            setLibros((prev) => [
                ...prev,
                {
                    titulo: libroGuardado.nombre ?? titulo.trim(),
                    descripcion: libroGuardado.descripcion ?? descripcionTrim,
                    texto: libroGuardado.texto ?? textoTrim,
                    genero: libroGuardado.genero ?? genero,
                },
            ])
            setTitulo('')
            setDescripcion('')
            setTexto('')
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

                <div className="library-form__row library-form__row--full">
                    <textarea
                        className="library-input"
                        rows={3}
                        maxLength={MAX_DESCRIPCION}
                        placeholder={`Descripción (máximo ${MAX_DESCRIPCION} caracteres)`}
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                    />
                    <div className="library-form__hint">
                        {descripcion.length}/{MAX_DESCRIPCION} caracteres
                    </div>
                </div>

                <div className="library-form__row library-form__row--full">
                    <textarea
                        className="library-input"
                        rows={6}
                        maxLength={MAX_TEXTO}
                        placeholder={`Texto (máximo ${MAX_TEXTO} caracteres)`}
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                    />
                    <div className="library-form__hint">
                        {texto.length}/{MAX_TEXTO} caracteres
                    </div>
                </div>

                <div className="library-form__row library-form__row--full">
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
                            <th>Descripción</th>
                            <th>Texto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {libros.map((libro, index) => (
                            <tr key={index}>
                                <td>{libro.titulo}</td>
                                <td>{libro.descripcion}</td>
                                <td>{libro.texto}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}

export default NewBook