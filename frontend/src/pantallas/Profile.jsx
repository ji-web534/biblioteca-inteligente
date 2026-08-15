import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { obtenerMisLibros, removerLibro, eliminarLibro, restaurarLibro } from '../fetch/libros'
import { obtenerFavoritos, agregarFavorito, quitarFavorito } from '../fetch/favorites'
import ActionMenu from '../components/ActionMenu'

function Profile() {
    const { usuario, estaAutenticado, logout, updateProfileContext } = useAuth()
    const navigate = useNavigate()
    const [libros, setLibros] = useState([])
    const [favoritos, setFavoritos] = useState([])
    const [cargandoLibros, setCargandoLibros] = useState(true)
    const [cargandoFavs, setCargandoFavs] = useState(true)
    const [nombreEdit, setNombreEdit] = useState(usuario?.nombre || '')
    const [emailEdit, setEmailEdit] = useState(usuario?.email || '')
    const [editando, setEditando] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [seccionActiva, setSeccionActiva] = useState('mis-libros')

    useEffect(() => {
        if (!estaAutenticado) {
            navigate('/iniciar-sesion')
            return
        }
        cargarLibros()
        cargarFavoritos()
    }, [estaAutenticado])

    useEffect(() => {
        if (usuario) {
            setNombreEdit(usuario.nombre || '')
            setEmailEdit(usuario.email || '')
        }
    }, [usuario])

    const cargarLibros = async () => {
        try {
            const resultado = await obtenerMisLibros()
            setLibros(resultado?.data || [])
        } catch (error) {
            console.error(error.message)
            setLibros([])
        } finally {
            setCargandoLibros(false)
        }
    }

    const cargarFavoritos = async () => {
        try {
            const data = await obtenerFavoritos()
            setFavoritos(data || [])
        } catch (error) {
            console.error(error.message)
            setFavoritos([])
        } finally {
            setCargandoFavs(false)
        }
    }

    const handleAgregarFavorito = async (libroId) => {
        const result = await agregarFavorito(libroId)
        if (result) {
            const libro = libros.find((l) => l._id === libroId)
            if (libro) setFavoritos((prev) => [...prev, libro])
        }
    }

    const handleQuitarFavorito = async (libroId) => {
        const result = await quitarFavorito(libroId)
        if (result) {
            setFavoritos((prev) => prev.filter((l) => l._id !== libroId))
        }
    }

    const handleRemoverLibro = async (libroId) => {
        const result = await removerLibro(libroId)
        if (result) {
            setLibros((prev) => prev.filter((l) => l._id !== libroId))
        }
    }

    const handleEliminarLibro = async (libroId) => {
        const result = await eliminarLibro(libroId)
        if (result) {
            setLibros((prev) => prev.filter((l) => l._id !== libroId))
        }
    }

    const handleRestaurarLibro = async (libroId) => {
        const result = await restaurarLibro(libroId)
        if (result) {
            alert(result.message)
            cargarLibros()
        }
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault()
        const data = await updateProfileContext(nombreEdit.trim(), emailEdit.trim())
        if (data) {
            setNombreEdit(data.nombre || '')
            setEmailEdit(data.email || '')
            setEditando(false)
        }
    }

    const esFavorito = (libroId) => (favoritos || []).some((f) => f._id === libroId)

    if (!estaAutenticado) return null

    return (
        <section className="library-page">
            <div style={{ display: 'flex', height: '100%' }}>
                {/* Sidebar */}
                <aside
                    className="library-sidebar"
                    style={{
                        position: 'fixed',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: sidebarOpen ? '240px' : '60px',
                        minWidth: '60px',
                        background: 'rgba(255,252,246,0.95)',
                        borderRight: '1px solid var(--border)',
                        padding: '2rem 1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        transition: 'width 0.3s ease-in-out',
                        zIndex: 1000,
                        boxShadow: sidebarOpen ? '2px 0 4px rgba(0,0,0,0.1)' : 'none'
                    }}
                >
                    {/* Usuario */}
                    {sidebarOpen && (
                        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                            <h3 className="library-page__title" style={{ fontSize: '1.1rem', borderBottom: 'none', paddingBottom: 0 }}>
                                {usuario?.nombre}
                            </h3>
                            <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', margin: '0' }}>
                                {usuario?.email}
                            </p>
                            <span style={{
                                display: 'inline-block',
                                marginTop: '0.5rem',
                                padding: '0.25rem 0.75rem',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                borderRadius: '4px',
                                background: usuario?.role === 'admin' ? 'var(--leather)' : usuario?.role === 'moderator' ? 'var(--gold)' : 'var(--border)',
                                color: usuario?.role === 'user' ? 'var(--ink)' : 'var(--parchment)'
                            }}>
                                {usuario?.role || 'user'}
                            </span>
                        </div>
                    )}

                    {/* Navegación */}
                    {sidebarOpen && (
                        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <button
                                className="library-button"
                                onClick={() => { setSeccionActiva('editar-perfil'); setEditando(true) }}
                                style={{ textAlign: 'left', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                            >
                                Editar perfil
                            </button>
                            <button
                                className="library-button"
                                onClick={() => setSeccionActiva('mis-libros')}
                                style={{ textAlign: 'left', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                            >
                                Mis libros
                            </button>
                            <button
                                className="library-button"
                                onClick={() => setSeccionActiva('favoritos')}
                                style={{ textAlign: 'left', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                            >
                                Favoritos
                            </button>
                            <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid var(--border)' }} />
                            <Link
                                to="/nuevo-libro"
                                className="library-link"
                                style={{ textAlign: 'left', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                            >
                                Agregar libro
                            </Link>
                            <Link
                                to="/buscador"
                                className="library-link"
                                style={{ textAlign: 'left', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                            >
                                Buscar libros
                            </Link>
                            <Link
                                to="/cambiar-contrasena"
                                className="library-link"
                                style={{ textAlign: 'left', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                            >
                                Cambiar contraseña
                            </Link>
                            <button
                                className="library-button"
                                onClick={() => { logout(); navigate('/') }}
                                style={{
                                    textAlign: 'left',
                                    padding: '0.5rem 1rem',
                                    fontSize: '0.9rem',
                                    marginTop: '2rem',
                                    background: 'var(--ink-error)',
                                    color: 'white'
                                }}
                            >
                                Cerrar sesión
                            </button>
                        </nav>
                    )}
                </aside>

                {/* Content principal */}
                <main style={{
                    flex: 1,
                    padding: '2rem',
                    overflowX: 'auto',
                    marginLeft: sidebarOpen ? '240px' : '60px',
                    transition: 'margin-left 0.3s ease-in-out',
                    minHeight: '100vh'
                }}>
                    {/* Botón de toggle flotante en el borde de la pantalla */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        style={{
                            position: 'fixed',
                            left: sidebarOpen ? '230px' : '50px',
                            top: '1rem',
                            zIndex: 1100,
                            background: 'var(--leather)',
                            color: 'var(--parchment)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '36px',
                            height: '36px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem',
                            transition: 'left 0.3s ease-in-out',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                        }}
                        title={sidebarOpen ? "Contraer sidebar" : "Expandir sidebar"}
                    >
                        {sidebarOpen ? '◀' : '▶'}
                    </button>
                    {/* Formulario de edición perfil */}
                    {editando && seccionActiva === 'editar-perfil' && (
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 className="library-page__title" style={{ fontSize: '1.3rem' }}>Editar perfil</h3>
                            <form className="library-form" onSubmit={handleUpdateProfile}>
                                <div className="library-form__row library-form__row--full">
                                    <input
                                        className="library-input"
                                        type="text"
                                        placeholder="Nombre"
                                        value={nombreEdit}
                                        onChange={(e) => setNombreEdit(e.target.value)}
                                    />
                                </div>
                                <div className="library-form__row library-form__row--full">
                                    <input
                                        className="library-input"
                                        type="email"
                                        placeholder="Email"
                                        value={emailEdit}
                                        onChange={(e) => setEmailEdit(e.target.value)}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button className="library-button" type="submit">Guardar cambios</button>
                                    <button
                                        className="library-button"
                                        type="button"
                                        style={{ background: 'var(--ink-soft)', color: 'var(--parchment)' }}
                                        onClick={() => {
                                            setEditando(false)
                                            setNombreEdit(usuario?.nombre || '')
                                            setEmailEdit(usuario?.email || '')
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Botón de editar cuando no está en modo edición */}
                    {!editando && seccionActiva === 'editar-perfil' && (
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 className="library-page__title" style={{ fontSize: '1.3rem' }}>Editar perfil</h3>
                            <button
                                className="library-button"
                                onClick={() => setEditando(true)}
                            >
                                Editar perfil
                            </button>
                        </div>
                    )}

                    {/* Mis libros */}
                    {seccionActiva === 'mis-libros' && (
                        <div>
                            <h3 className="library-page__title" style={{ fontSize: '1.3rem' }}>Mis Libros</h3>
                            <p className="library-page__text" style={{ fontSize: '0.9rem' }}>Libros que has creado ({libros.length})</p>
                            {cargandoLibros ? <p>Cargando...</p> : libros.length === 0 ? (
                                <p style={{ fontStyle: 'italic', color: 'var(--ink-soft)' }}>Aún no has creado ningún libro.</p>
                            ) : (
                                <div className="library-table-wrap">
                                    <table className="library-table">
                                        <thead>
                                            <tr><th>Título</th><th>Descripción</th><th></th></tr>
                                        </thead>
                                        <tbody>
                                            {libros.map((libro) => (
                                                <tr key={libro._id}>
                                                    <td>{libro.nombre}</td>
                                                    <td style={{ fontSize: '0.85rem' }}>{libro.descripcion}</td>
                                                    <td>
                                                {esFavorito(libro._id) ? (
                                                    <button className="library-button" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', marginRight: '0.25rem' }} onClick={() => handleQuitarFavorito(libro._id)}>
                                                        Quitar favorito
                                                    </button>
                                                ) : (
                                                    <button className="library-button" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', marginRight: '0.25rem' }} onClick={() => handleAgregarFavorito(libro._id)}>
                                                        Favorito
                                                    </button>
                                                )}
                                                <ActionMenu opciones={[
                                                    { etiqueta: 'Ver libro', accion: () => navigate(`/libro/${libro._id}`) },
                                                    { etiqueta: 'Remover libro', accion: () => handleRemoverLibro(libro._id) },
                                                    { etiqueta: 'Eliminar libro', accion: () => handleEliminarLibro(libro._id) },
                                                    { etiqueta: 'Restaurar libro', accion: () => handleRestaurarLibro(libro._id) },
                                                ]} />
                                            </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Favoritos */}
                    {seccionActiva === 'favoritos' && (
                        <div>
                            <h3 className="library-page__title" style={{ fontSize: '1.3rem' }}>Favoritos</h3>
                            <p className="library-page__text" style={{ fontSize: '0.9rem' }}>Tus libros favoritos ({favoritos.length})</p>
                            {cargandoFavs ? <p>Cargando...</p> : favoritos.length === 0 ? (
                                <p style={{ fontStyle: 'italic', color: 'var(--ink-soft)' }}>No tienes libros favoritos aún.</p>
                            ) : (
                                <div className="library-table-wrap">
                                    <table className="library-table">
                                        <thead>
                                            <tr><th>Título</th><th>Descripción</th><th></th></tr>
                                        </thead>
                                        <tbody>
                                            {favoritos.map((libro) => (
                                                <tr key={libro._id}>
                                                    <td>{libro.nombre}</td>
                                                    <td style={{ fontSize: '0.85rem' }}>{libro.descripcion}</td>
                                                    <td>
                                                        <button className="library-button" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={() => handleQuitarFavorito(libro._id)}>
                                                            Quitar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </section>
    )
}

export default Profile
