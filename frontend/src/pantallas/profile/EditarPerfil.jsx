import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'

function EditarPerfil() {
    const { usuario, updateProfileContext } = useAuth()
    const [nombreEdit, setNombreEdit] = useState(usuario?.nombre || '')
    const [emailEdit, setEmailEdit] = useState(usuario?.email || '')

    useEffect(() => {
        if (usuario) {
            setNombreEdit(usuario.nombre || '')
            setEmailEdit(usuario.email || '')
        }
    }, [usuario])

    const handleUpdateProfile = async (e) => {
        e.preventDefault()
        const data = await updateProfileContext(nombreEdit.trim(), emailEdit.trim())
        if (data) {
            setNombreEdit(data.nombre || '')
            setEmailEdit(data.email || '')
        }
    }

    return (
        <div style={{ marginBottom: '1rem' }}>
            <h3 className="library-page__title" style={{ fontSize: '1.2rem' }}>Editar perfil</h3>
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
                </div>
            </form>
        </div>
    )
}

export default EditarPerfil