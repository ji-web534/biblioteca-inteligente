import { useState } from 'react'
import { crearLibro } from '../fetch/fetch_nuevo_libro'

function Nuevo_libro() {
    const [titulo, setTitulo] = useState('')
    const [autor, setAutor] = useState('')
    const [editorial, setEditorial] = useState('')
    const [anio, setAnio] = useState('')
    const [isbn, setIsbn] = useState('')
    const [libros, setLibros] = useState([])
    const [guardando, setGuardando] = useState(false)

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
        const libroGuardado = await crearLibro(titulo.trim(), descripcion.trim())
        setGuardando(false)

        if (libroGuardado) {
            setLibros((prev) => [
                ...prev,
                {
                    titulo: libroGuardado.nombre ?? titulo.trim(),
                    autor: autor.trim(),
                    descripcion: libroGuardado.descripcion ?? descripcion,
                },
            ])
            setTitulo('')
            setAutor('')
            setEditorial('')
            setAnio('')
            setIsbn('')
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Titulo"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Autor"
                    value={autor}
                    onChange={(e) => setAutor(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Editorial"
                    value={editorial}
                    onChange={(e) => setEditorial(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Año"
                    value={anio}
                    onChange={(e) => setAnio(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="ISBN"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                />
                <button type="submit" disabled={guardando}>
                    {guardando ? 'Guardando...' : 'Guardar'}
                </button>
            </form>
            <table>
                <thead>
                    <tr>
                        <th>Titulo</th>
                        <th>Autor</th>
                        <th>descripcion</th>
                    </tr>
                </thead>
                <tbody>
                    {libros.map((libro, index) => (
                        <tr key={index}>
                            <td>{libro.titulo}</td>
                            <td>{libro.autor}</td>
                            <td>{libro.descripcion}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Nuevo_libro
