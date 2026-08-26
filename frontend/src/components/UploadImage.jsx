import { useState } from 'react'
import { authFetch, API } from '../fetch/authFetch'

// Pre-validación solo para UX; la validación real ocurre en el backend.
const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024

function UploadImage({ onUpload, urlActual = '' }) {
    const [url, setUrl] = useState(urlActual)
    const [subiendo, setSubiendo] = useState(false)
    const [error, setError] = useState('')

    const handleChange = async (e) => {
        const file = e.target.files?.[0]
        e.target.value = ''
        if (!file) return

        if (!TIPOS_PERMITIDOS.includes(file.type)) {
            setError('Formato no válido. Use JPG, PNG o WebP.')
            return
        }

        if (file.size > MAX_SIZE) {
            setError('La imagen supera los 5MB.')
            return
        }

        setSubiendo(true)
        setError('')

        try {
            const formData = new FormData()
            formData.append('imagen', file)

            const response = await authFetch(`${API}/portada`, {
                method: 'POST',
                body: formData
            })

            const resultado = await response.json().catch(() => ({}))

            if (!response.ok) {
                throw new Error(resultado.message || 'Error al subir la imagen.')
            }

            setUrl(resultado.data.url)
            onUpload?.(resultado.data.url)
        } catch (err) {
            console.error(err.message)
            setError(err.message || 'Error inesperado al subir la imagen.')
        } finally {
            setSubiendo(false)
        }
    }

    return (
        <div>
            <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleChange}
                disabled={subiendo}
            />
            {subiendo && <p style={{ fontSize: '0.85rem' }}>Subiendo imagen...</p>}
            {error && <p style={{ color: 'var(--ink-error)', fontSize: '0.85rem' }}>{error}</p>}
            {url && (
                <img
                    src={url}
                    alt="Vista previa de la portada"
                    style={{ maxWidth: '200px', marginTop: '0.5rem', display: 'block', borderRadius: '4px' }}
                />
            )}
        </div>
    )
}

export default UploadImage