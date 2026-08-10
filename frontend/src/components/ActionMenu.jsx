import { useState, useRef, useEffect } from 'react'

function ActionMenu({ opciones }) {
    const [abierto, setAbierto] = useState(false)
    const contenedorRef = useRef(null)

    useEffect(() => {
        if (!abierto) return

        const cerrarClickFuera = (e) => {
            if (contenedorRef.current && !contenedorRef.current.contains(e.target)) {
                setAbierto(false)
            }
        }
        const cerrarEscape = (e) => {
            if (e.key === 'Escape') setAbierto(false)
        }

        document.addEventListener('mousedown', cerrarClickFuera)
        document.addEventListener('keydown', cerrarEscape)
        return () => {
            document.removeEventListener('mousedown', cerrarClickFuera)
            document.removeEventListener('keydown', cerrarEscape)
        }
    }, [abierto])

    return (
        <div className="action-menu" ref={contenedorRef}>
            <button
                className="action-menu__toggle"
                type="button"
                aria-label="Más acciones"
                aria-haspopup="menu"
                aria-expanded={abierto}
                onClick={() => setAbierto((v) => !v)}
            >
                ⋮
            </button>
            {abierto && (
                <div className="action-menu__lista" role="menu">
                    {opciones.map((opcion, index) => (
                        <button
                            key={index}
                            className="action-menu__item"
                            type="button"
                            role="menuitem"
                            onClick={() => {
                                setAbierto(false)
                                opcion.accion()
                            }}
                        >
                            {opcion.etiqueta}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ActionMenu