import { backendError } from "../helpers/error_class"
import { authFetch } from "./authFetch"

const API = "http://localhost:8000/app/bibilo"

export async function obtenerCategorias() {
    try {
        const response = await fetch(`${API}/categorias`)
        const resultado = await response.json()
        if (!response.ok) {
            throw new backendError(resultado.message || "Error al obtener las categorías.")
        }
        return resultado.data
    } catch (error) {
        const mensaje = error.message === "Failed to fetch"
            ? "Error de comunicación con el servidor."
            : error.message
        throw new Error(mensaje)
    }
}

export async function crearCategoria(nombre, descripcion) {
    try {
        const response = await authFetch(`${API}/categorias`, {
            method: "POST",
            body: JSON.stringify({ nombre, descripcion }),
        })
        const resultado = await response.json()
        if (!response.ok) {
            throw new backendError(resultado.message || "Error al crear la categoría.")
        }
        return resultado.data
    } catch (error) {
        const mensaje = error.message === "Failed to fetch"
            ? "Error de comunicación con el servidor."
            : error.message
        throw new Error(mensaje)
    }
}

export async function editarCategoria(id, datos) {
    try {
        const response = await authFetch(`${API}/categorias/${id}`, {
            method: "PUT",
            body: JSON.stringify(datos),
        })
        const resultado = await response.json()
        if (!response.ok) {
            throw new backendError(resultado.message || "Error al actualizar la categoría.")
        }
        return resultado.data
    } catch (error) {
        const mensaje = error.message === "Failed to fetch"
            ? "Error de comunicación con el servidor."
            : error.message
        throw new Error(mensaje)
    }
}

export async function desactivarCategoria(id) {
    try {
        const response = await authFetch(`${API}/categorias/${id}`, {
            method: "DELETE",
        })
        const resultado = await response.json()
        if (!response.ok) {
            throw new backendError(resultado.message || "Error al desactivar la categoría.")
        }
        return resultado.data
    } catch (error) {
        const mensaje = error.message === "Failed to fetch"
            ? "Error de comunicación con el servidor."
            : error.message
        throw new Error(mensaje)
    }
}