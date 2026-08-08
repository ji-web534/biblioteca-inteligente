import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import {
    obtenerCategorias,
    crearCategoria,
    editarCategoria,
    desactivarCategoria,
} from "../fetch/categorias"

function AdminCategories() {
    const { esAdmin, tienePermiso } = useAuth()
    const puedeGestionar = () =>
        esAdmin() || tienePermiso("can_manage_categories")

    const [categorias, setCategorias] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState("")

    const [nombre, setNombre] = useState("")
    const [descripcion, setDescripcion] = useState("")
    const [guardando, setGuardando] = useState(false)

    const [editandoId, setEditandoId] = useState(null)
    const [editNombre, setEditNombre] = useState("")
    const [editDescripcion, setEditDescripcion] = useState("")
    const [editando, setEditando] = useState(null)

    useEffect(() => {
        if (!puedeGestionar()) {
            setError("No tienes acceso a esta página.")
            setCargando(false)
            return
        }
        cargarCategorias()
    }, [esAdmin, tienePermiso])

    const cargarCategorias = async () => {
        try {
            const data = await obtenerCategorias()
            setCategorias(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setCargando(false)
        }
    }

    const handleCrear = async (e) => {
        e.preventDefault()
        if (!nombre.trim()) {
            alert("El nombre es obligatorio.")
            return
        }
        setGuardando(true)
        try {
            const nueva = await crearCategoria(nombre.trim(), descripcion.trim())
            setCategorias((prev) => [...prev, nueva])
            setNombre("")
            setDescripcion("")
        } catch (err) {
            alert(err.message)
        } finally {
            setGuardando(false)
        }
    }

    const iniciarEdicion = (categoria) => {
        setEditandoId(categoria._id)
        setEditNombre(categoria.nombre)
        setEditDescripcion(categoria.descripcion || "")
    }

    const guardarEdicion = async (id) => {
        setEditando(id)
        try {
            const actualizada = await editarCategoria(id, {
                nombre: editNombre.trim(),
                descripcion: editDescripcion.trim(),
            })
            setCategorias((prev) =>
                prev.map((c) => (c._id === id ? actualizada : c))
            )
            setEditandoId(null)
        } catch (err) {
            alert(err.message)
        } finally {
            setEditando(null)
        }
    }

    const handleDesactivar = async (categoria) => {
        const confirmar = window.confirm(
            `¿Desactivar la categoría "${categoria.nombre}"? Dejará de estar disponible para nuevos libros.`
        )
        if (!confirmar) return
        try {
            const actualizada = await desactivarCategoria(categoria._id)
            setCategorias((prev) =>
                prev.map((c) => (c._id === categoria._id ? actualizada : c))
            )
        } catch (err) {
            alert(err.message)
        }
    }

    if (cargando) {
        return (
            <section className="library-page">
                <p>Cargando...</p>
            </section>
        )
    }

    if (error) {
        return (
            <section className="library-page">
                <Link className="library-link library-link--secondary" to="/">
                    Volver al inicio
                </Link>
                <h2 className="library-page__title">Acceso denegado</h2>
                <p className="library-page__text" style={{ color: "red" }}>
                    {error}
                </p>
            </section>
        )
    }

    return (
        <section className="library-page">
            <Link className="library-link library-link--secondary" to="/">
                Volver al inicio
            </Link>

            <h2 className="library-page__title">Administración de categorías</h2>
            <p className="library-page__text">
                Crea, edita o desactiva las categorías del catálogo.
            </p>

            <form className="library-form" onSubmit={handleCrear}>
                <div className="library-form__row library-form__row--full">
                    <input
                        className="library-input"
                        type="text"
                        placeholder="Nueva categoría"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                </div>
                <div className="library-form__row library-form__row--full">
                    <input
                        className="library-input"
                        type="text"
                        placeholder="Descripción (opcional)"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                    />
                </div>
                <button className="library-button" type="submit" disabled={guardando}>
                    {guardando ? "Guardando..." : "Crear categoría"}
                </button>
            </form>

            {categorias.length === 0 ? (
                <div className="library-empty-state">
                    <div className="library-empty-state__icon">🏷️</div>
                    <h3 className="library-empty-state__title">No hay categorías</h3>
                    <p className="library-empty-state__text">
                        Crea la primera categoría para clasificar los libros.
                    </p>
                </div>
            ) : (
                <div className="library-table-wrap" style={{ marginTop: "1.5rem" }}>
                    <table className="library-table">
                        <thead>
                            <tr>
                                <th>Categoría</th>
                                <th>Descripción</th>
                                <th>Estado</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categorias.map((categoria) =>
                                editandoId === categoria._id ? (
                                    <tr key={categoria._id}>
                                        <td>
                                            <input
                                                className="library-input"
                                                type="text"
                                                value={editNombre}
                                                onChange={(e) => setEditNombre(e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className="library-input"
                                                type="text"
                                                value={editDescripcion}
                                                onChange={(e) =>
                                                    setEditDescripcion(e.target.value)
                                                }
                                            />
                                        </td>
                                        <td>
                                            {categoria.activo ? "Activa" : "Inactiva"}
                                        </td>
                                        <td>
                                            <button
                                                className="library-button"
                                                style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem" }}
                                                onClick={() => guardarEdicion(categoria._id)}
                                                disabled={editando === categoria._id}
                                            >
                                                Guardar
                                            </button>
                                            <button
                                                className="library-button library-button--outline"
                                                style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem" }}
                                                onClick={() => setEditandoId(null)}
                                            >
                                                Cancelar
                                            </button>
                                        </td>
                                    </tr>
                                ) : (
                                    <tr key={categoria._id}>
                                        <td>{categoria.nombre}</td>
                                        <td style={{ fontSize: "0.85rem" }}>
                                            {categoria.descripcion || "—"}
                                        </td>
                                        <td>
                                            <span
                                                style={{
                                                    display: "inline-block",
                                                    padding: "0.2rem 0.6rem",
                                                    borderRadius: "4px",
                                                    fontSize: "0.8rem",
                                                    fontWeight: "bold",
                                                    textTransform: "uppercase",
                                                    background: categoria.activo
                                                        ? "var(--gold)"
                                                        : "var(--border)",
                                                    color: categoria.activo
                                                        ? "var(--ink)"
                                                        : "var(--ink-soft)",
                                                }}
                                            >
                                                {categoria.activo ? "Activa" : "Inactiva"}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="library-button"
                                                style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem", marginRight: "0.25rem" }}
                                                onClick={() => iniciarEdicion(categoria)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="library-button"
                                                style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem", background: "var(--ink-error, #c00)", color: "var(--parchment)" }}
                                                onClick={() => handleDesactivar(categoria)}
                                                disabled={!categoria.activo}
                                            >
                                                Desactivar
                                            </button>
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    )
}

export default AdminCategories