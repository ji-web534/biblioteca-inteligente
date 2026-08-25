import { useState } from 'react'

const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET

const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

function UploadImage({ onUpload, urlActual = '' }) {
    const [url, setUrl] = useState(urlActual)
    const [subiendo, setSubiendo] = useState(false)
    const [error, setError] = useState('')

    const handleChange = async (e) => {
        const file = e.target.files?.[0]
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
            formData.append('file', file)
            formData.append('upload_preset', UPLOAD_PRESET)

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                { method: 'POST', body: formData }
            )

            const resultado = await response.json()

            if (!response.ok) {
                throw new Error(resultado.error?.message || 'Error al subir la imagen.')
            }

            setUrl(resultado.secure_url)
            onUpload?.(resultado.secure_url)
        } catch (err) {
            console.error(err.message)
            setError(err.message || 'Error inesperado al subir la imagen.')
        } finally {
            setSubiendo(false)
        }
    }

    return (
        <div>
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleChange} />
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