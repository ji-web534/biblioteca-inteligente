import { backendError } from "../helpers/error_class"
import { authFetch } from "./authFetch"

const API = "http://localhost:8000/app/bibilo"

export async function obtenerUsuarios() {
    try {
        const response = await authFetch(`${API}/admin/usuarios`)
        const resultado = await response.json()
        if (!response.ok) {
            throw new backendError(resultado.message || "Error al obtener usuarios.")
        }
        return resultado.data
    } catch (error) {
        const mensaje = error.message === "Failed to fetch"
            ? "Error de comunicación con el servidor."
            : error.message
        throw new Error(mensaje)
    }
}

export async function cambiarRolUsuario(id, role) {
    try {
        const response = await authFetch(`${API}/admin/usuarios/${id}/role`, {
            method: "PUT",
            body: JSON.stringify({ role }),
        })
        const resultado = await response.json()
        if (!response.ok) {
            throw new backendError(resultado.message || "Error al cambiar el rol.")
        }
        return resultado
    } catch (error) {
        const mensaje = error.message === "Failed to fetch"
            ? "Error de comunicación con el servidor."
            : error.message
        throw new Error(mensaje)
    }
}

export async function cambiarPermisosUsuario(id, permisos) {
    try {
        const response = await authFetch(`${API}/admin/usuarios/${id}/permisos`, {
            method: "PUT",
            body: JSON.stringify({ permisos }),
        })
        const resultado = await response.json()
        if (!response.ok) {
            throw new backendError(resultado.message || "Error al cambiar los permisos.")
        }
        return resultado
    } catch (error) {
        const mensaje = error.message === "Failed to fetch"
            ? "Error de comunicación con el servidor."
            : error.message
        throw new Error(mensaje)
    }
}
