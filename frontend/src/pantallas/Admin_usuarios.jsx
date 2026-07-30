import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { obtenerUsuarios, cambiarRolUsuario } from "../fetch/admin"

const ROLES = ["user", "moderator", "admin"]

function Admin_usuarios() {
    const { esAdmin } = useAuth()
    const [usuarios, setUsuarios] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState("")
    const [guardando, setGuardando] = useState(null)

    useEffect(() => {
        if (!esAdmin()) {
            setError("No tienes acceso a esta página.")
            setCargando(false)
            return
        }
        cargarUsuarios()
    }, [esAdmin])

    const cargarUsuarios = async () => {
        try {
            const data = await obtenerUsuarios()
            setUsuarios(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setCargando(false)
        }
    }

    const handleCambiarRol = async (idUsuario, nuevoRol) => {
        setGuardando(idUsuario)
        try {
            await cambiarRolUsuario(idUsuario, nuevoRol)
            setUsuarios((prev) =>
                prev.map((u) => (u._id === idUsuario ? { ...u, role: nuevoRol } : u))
            )
        } catch (err) {
            alert(err.message)
        } finally {
            setGuardando(null)
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

            <h2 className="library-page__title">Administración de usuarios</h2>

            {usuarios.length === 0 ? (
                <p className="library-page__text">No hay usuarios registrados.</p>
            ) : (
                <div className="library-table-wrap">
                    <table className="library-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((usuario) => (
                                <tr key={usuario._id}>
                                    <td>{usuario.nombre}</td>
                                    <td>{usuario.email}</td>
                                    <td>
                                        <span
                                            style={{
                                                display: "inline-block",
                                                padding: "0.2rem 0.6rem",
                                                borderRadius: "4px",
                                                fontSize: "0.8rem",
                                                fontWeight: "bold",
                                                textTransform: "uppercase",
                                                background:
                                                    usuario.role === "admin"
                                                        ? "var(--leather)"
                                                        : usuario.role === "moderator"
                                                        ? "var(--gold)"
                                                        : "var(--border)",
                                                color:
                                                    usuario.role === "user"
                                                        ? "var(--ink)"
                                                        : "var(--parchment)",
                                            }}
                                        >
                                            {usuario.role}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            className="library-input"
                                            style={{ width: "auto", padding: "0.3rem" }}
                                            value={usuario.role}
                                            onChange={(e) =>
                                                handleCambiarRol(usuario._id, e.target.value)
                                            }
                                            disabled={guardando === usuario._id}
                                        >
                                            {ROLES.map((rol) => (
                                                <option key={rol} value={rol}>
                                                    {rol}
                                                </option>
                                            ))}
                                        </select>
                                        {guardando === usuario._id && (
                                            <span style={{ marginLeft: "0.5rem", fontSize: "0.8rem" }}>
                                                Guardando...
                                            </span>
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

export default Admin_usuarios
