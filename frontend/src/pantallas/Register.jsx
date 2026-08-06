import { useState } from 'react'
import { Link } from 'react-router-dom'
import { registrarUsuario } from '../fetch/auth'

function Register() {
    // los estados que vamos a usar para hacer el registro
    const [nombre, setNombre] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    
  
    const [usuarios, setUsuarios] = useState([])
    const [guardando, setGuardando] = useState(false)
    const [errorMensaje, setErrorMensaje] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMensaje('')

        if (!nombre.trim() || !email.trim() || !password.trim()) {
            setErrorMensaje('Todos los campos son obligatorios.')
            return
        }

        setGuardando(true)

        try {
            const respuesta = await registrarUsuario(nombre, email, password);

            alert(respuesta.message || "¡Usuario registrado!");

            setUsuarios((prev) => [
                ...prev,
                {
                    id: respuesta._id,
                    nombre: respuesta.nombre,
                    email: respuesta.email,
                },
            ])

            setNombre('')
            setEmail('')
            setPassword('')
        } catch (error) {
            setErrorMensaje(error.message)
        } finally {
            setGuardando(false)
        }
    }

    return (
        <section className="library-page">
            <Link className="library-link library-link--secondary" to="/">
                Volver al inicio
            </Link>

            <h2 className="library-page__title">Registro de nuevo usuario</h2>
            <p className="library-page__text">
                Crea una cuenta para empezar a usar la biblioteca inteligente.
            </p>

            <form className="library-form" onSubmit={handleSubmit}>
              
                <div className="library-form__row library-form__row--full">
                    <input
                        className="library-input"
                        type="text"
                        placeholder="Nombre completo"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                </div>

           
                <div className="library-form__row">
                    <input
                        className="library-input"
                        type="email" 
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="library-input"
                        type="password" 
                        placeholder="Contraseña (mínimo 6 caracteres)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

      
                {errorMensaje && (
                    <p style={{ color: 'red', fontWeight: 'bold', margin: '10px 0' }}>
                        ⚠️ {errorMensaje}
                    </p>
                )}

                <button className="library-button" type="submit" disabled={guardando}>
                    {guardando ? 'Registrando...' : 'Registrarse'}
                </button>
            </form>

         
            <div className="library-table-wrap">
                <table className="library-table">
                    <thead>
                        <tr>
                            <th>ID de Usuario</th>
                            <th>Nombre</th>
                            <th>Correo Electrónico</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((usr, index) => (
                            <tr key={index}>
                                <td style={{ fontSize: '12px', color: '#666' }}>{usr.id}</td>
                                <td>{usr.nombre}</td>
                                <td>{usr.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}

export default Register