import { backendError } from "../helpers/error_class"
import { authFetch } from "./authFetch"

const API = "http://localhost:8000/app/bibilo"

export async function obtenerAdminLibros(eliminados) {
    try {
        const params = new URLSearchParams()
        if (eliminados !== undefined) {
            params.set("eliminados", String(eliminados))
        }
        const query = params.toString()
        const response = await authFetch(`${API}/admin/libros${query ? "?" + query : ""}`)
        const resultado = await response.json()
        if (!response.ok) {
            throw new backendError(resultado.message || "Error al obtener los libros.")
        }
        return resultado.data
    } catch (error) {
        const mensaje = error.message === "Failed to fetch"
            ? "Error de comunicación con el servidor."
            : error.message
        throw new Error(mensaje)
    }
}

export async function restaurarLibroAdmin(libroId) {
    try {
        const response = await authFetch(`${API}/admin/libros/${libroId}/restore`, {
            method: "PUT",
        })
        const resultado = await response.json()
        if (!response.ok) {
            throw new backendError(resultado.message || "Error al restaurar el libro.")
        }
        return resultado
    } catch (error) {
        const mensaje = error.message === "Failed to fetch"
            ? "Error de comunicación con el servidor."
            : error.message
        throw new Error(mensaje)
    }
}
