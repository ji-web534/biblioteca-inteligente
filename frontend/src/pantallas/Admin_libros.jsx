import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { obtenerAdminLibros, restaurarLibroAdmin } from "../fetch/admin_libros"

function Admin_libros() {
    const { esAdmin } = useAuth()
    const [libros, setLibros] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState("")
    const [filtroEliminados, setFiltroEliminados] = useState("todos")
    const [restaurando, setRestaurando] = useState(null)

    useEffect(() => {
        if (!esAdmin()) {
            setError("No tienes acceso a esta página.")
            setCargando(false)
            return
        }
        cargarLibros()
    }, [esAdmin, filtroEliminados])

    const cargarLibros = async () => {
        setCargando(true)
        setError("")
        try {
            const eliminados = filtroEliminados === "eliminados" ? true : filtroEliminados === "activos" ? false : undefined
            const data = await obtenerAdminLibros(eliminados)
            setLibros(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setCargando(false)
        }
    }

    const handleRestaurar = async (libroId) => {
        setRestaurando(libroId)
        try {
            const result = await restaurarLibroAdmin(libroId)
            alert(result.message)
            cargarLibros()
        } catch (err) {
            alert(err.message)
        } finally {
            setRestaurando(null)
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

            <h2 className="library-page__title">Gestión de libros</h2>

            <div className="library-page__actions" style={{ marginBottom: "1rem", gap: "0.5rem" }}>
                <button
                    className="library-button"
                    style={{ padding: "0.3rem 0.8rem", fontSize: "0.85rem", background: filtroEliminados === "todos" ? "var(--leather)" : "var(--border)", color: "var(--parchment)" }}
                    onClick={() => setFiltroEliminados("todos")}
                >
                    Todos
                </button>
                <button
                    className="library-button"
                    style={{ padding: "0.3rem 0.8rem", fontSize: "0.85rem", background: filtroEliminados === "activos" ? "var(--leather)" : "var(--border)", color: "var(--parchment)" }}
                    onClick={() => setFiltroEliminados("activos")}
                >
                    Activos
                </button>
                <button
                    className="library-button"
                    style={{ padding: "0.3rem 0.8rem", fontSize: "0.85rem", background: filtroEliminados === "eliminados" ? "var(--leather)" : "var(--border)", color: "var(--parchment)" }}
                    onClick={() => setFiltroEliminados("eliminados")}
                >
                    Eliminados
                </button>
            </div>

            {libros.length === 0 ? (
                <div className="library-empty-state">
                    <div className="library-empty-state__icon">📚</div>
                    <h3 className="library-empty-state__title">
                        {filtroEliminados === "eliminados" ? "No hay libros eliminados" : filtroEliminados === "activos" ? "No hay libros activos" : "No hay libros registrados"}
                    </h3>
                    <p className="library-empty-state__text">
                        {filtroEliminados === "eliminados"
                            ? "Todos los libros están activos en este momento."
                            : filtroEliminados === "activos"
                            ? "No hay libros activos en este momento."
                            : "Aún no hay libros en la base de datos."}
                    </p>
                    <Link className="library-link" to="/">
                        Volver al inicio
                    </Link>
                </div>
            ) : (
                <div className="library-table-wrap">
                    <table className="library-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Autor</th>
                                <th>Estado</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {libros.map((libro) => (
                                <tr key={libro._id}>
                                    <td>{libro.nombre}</td>
                                    <td style={{ maxWidth: "20rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {libro.descripcion}
                                    </td>
                                    <td>{libro.autor}</td>
                                    <td>
                                        <span
                                            style={{
                                                display: "inline-block",
                                                padding: "0.2rem 0.6rem",
                                                borderRadius: "4px",
                                                fontSize: "0.8rem",
                                                fontWeight: "bold",
                                                textTransform: "uppercase",
                                                background: libro.activo ? "#2a7d2a" : "#c00",
                                                color: "var(--parchment)",
                                            }}
                                        >
                                            {libro.activo ? "activo" : "eliminado"}
                                        </span>
                                    </td>
                                    <td>
                                        {!libro.activo && (
                                            <button
                                                className="library-button"
                                                style={{ padding: "0.3rem 0.8rem", fontSize: "0.8rem", background: "var(--leather)", color: "var(--parchment)" }}
                                                onClick={() => handleRestaurar(libro._id)}
                                                disabled={restaurando === libro._id}
                                            >
                                                {restaurando === libro._id ? "Restaurando..." : "Restaurar"}
                                            </button>
                                        )}
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

export default Admin_libros
