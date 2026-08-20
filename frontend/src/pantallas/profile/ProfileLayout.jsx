import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function ProfileLayout() {
    const { usuario, estaAutenticado, logout } = useAuth()
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(true)

    useEffect(() => {
        if (!estaAutenticado) {
            navigate('/iniciar-sesion')
        }
    }, [estaAutenticado, navigate])

    if (!estaAutenticado) return null

    const sidebarWidth = sidebarOpen ? '25%' : '60px'

    const navButtonStyle = ({ isActive }) => ({
        textAlign: 'left',
        padding: '0.5rem 1rem',
        fontSize: '0.9rem',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        background: isActive ? 'var(--leather)' : 'transparent',
        color: isActive ? 'var(--parchment)' : 'var(--ink)',
        width: '100%'
    })

    const navLinkStyle = ({ isActive }) => ({
        textAlign: 'left',
        padding: '0.5rem 1rem',
        fontSize: '0.9rem',
        textDecoration: 'none',
        display: 'block',
        width: '100%',
        boxSizing: 'border-box',
        borderRadius: '4px',
        background: isActive ? 'var(--leather)' : 'transparent',
        color: isActive ? 'var(--parchment)' : 'var(--ink)'
    })

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            maxWidth: '100%',
            overflow: 'hidden',
            boxSizing: 'border-box'
        }}>
            {/* Sidebar + Main */}
            <div style={{ display: 'flex', width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden', minHeight: 0, gap: 0 }}>
                <aside
                    className="library-sidebar"
                    style={{
                        flex: `0 0 ${sidebarWidth}`,
                        flexShrink: 0,
                        minWidth: '60px',
                        maxWidth: '100%',
                        boxSizing: 'border-box',
                        background: '#ffffff',
                        borderRight: '1px solid var(--border)',
                        padding: '0.5rem 0.75rem',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'flex-basis 0.3s ease-in-out',
                        overflowY: 'auto',
                        overflowX: 'hidden'
                    }}
                >
                    {/* Botón toggle del sidebar */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        style={{
                            alignSelf: sidebarOpen ? 'flex-end' : 'center',
                            marginTop: '0',
                            marginBottom: '0.5rem',
                            padding: '0.5rem 1rem',
                            fontSize: '0.9rem',
                            background: 'var(--leather)',
                            color: 'var(--parchment)',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                        title={sidebarOpen ? "Contraer sidebar" : "Expandir sidebar"}
                    >
                        {sidebarOpen ? '◀ Contraer' : '▶'}
                    </button>

                    {/* Usuario */}
                    {sidebarOpen && (
                        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                            <h3 className="library-page__title" style={{ fontSize: '1.1rem', borderBottom: 'none', paddingBottom: 0 }}>
                                {usuario?.nombre}
                            </h3>
                            <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', margin: '0.25rem 0' }}>
                                {usuario?.email}
                            </p>
                            <span style={{
                                display: 'inline-block',
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
                            <NavLink
                                to="/perfil/editar-perfil"
                                className="library-link"
                                style={navLinkStyle}
                            >
                                Editar perfil
                            </NavLink>
                            <NavLink
                                to="/perfil/mis-libros"
                                className="library-link"
                                style={navLinkStyle}
                            >
                                Mis libros
                            </NavLink>
                            <NavLink
                                to="/perfil/favoritos"
                                className="library-link"
                                style={navLinkStyle}
                            >
                                Favoritos
                            </NavLink>
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

                {/* Contenido principal - flexible */}
                <main style={{
                    flex: '1 1 0',
                    flexShrink: 0,
                    minWidth: 0,
                    padding: '0.75rem',
                    boxSizing: 'border-box',
                    overflow: 'hidden'
                }}>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default ProfileLayout