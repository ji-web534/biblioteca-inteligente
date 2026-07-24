import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { confirmarEmail } from '../fetch/auth'

function ConfirmarCuenta() {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const [estado, setEstado] = useState('cargando')
    const [mensaje, setMensaje] = useState('')

    useEffect(() => {
        if (!token) {
            setEstado('error')
            setMensaje('Token no proporcionado en la URL')
            return
        }

        const verificar = async () => {
            try {
                const resultado = await confirmarEmail(token)
                setEstado('exito')
                setMensaje(resultado.message || 'Cuenta verificada correctamente')
            } catch (error) {
                setEstado('error')
                setMensaje(error.message || 'Error al verificar la cuenta')
            }
        }

        verificar()
    }, [token])

    return (
        <section className="library-page">
            <h2 className="library-page__title">Confirmar cuenta</h2>
            <p className="library-page__text">
                {estado === 'cargando' && 'Verificando tu cuenta...'}
                {estado === 'exito' && <span style={{ color: 'green' }}>✓ {mensaje}</span>}
                {estado === 'error' && <span style={{ color: 'red' }}>✗ {mensaje}</span>}
            </p>
            {estado !== 'cargando' && (
                <Link className="library-link" to="/iniciar-sesion">
                    Ir a iniciar sesión
                </Link>
            )}
        </section>
    )
}

export default ConfirmarCuenta