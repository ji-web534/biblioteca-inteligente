
import { backendError } from "../helpers/error_class";

export const confirmarEmail = async (token) => {
    try {
        // Le pegamos al endpoint de usuarios al backend
        const response = await fetch("http://localhost:8000/app/usuarios/confirmar", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token: token }) // Mandamos el token en el body
        });

        const resultado = await response.json();

        // Si el backend devuelve un código de error (400, 404, 500, etc.)
        if (!response.ok) {
            // Atajamos el mensaje exacto que configuraste en tu ServerError
            throw new backendError(resultado.message || "No se pudo verificar la cuenta.");
        }

        // Si todo salió bien, devolvemos la data al componente
        return resultado; 

    } catch (Error) {
        // Volvemos a lanzar el error para que el componente de React lo capture en su propio try/catch
       throw Error;
    }
};