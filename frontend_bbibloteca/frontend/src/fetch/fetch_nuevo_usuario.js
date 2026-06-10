
import { backendError } from "../helpers/error_class";

export const fetch_nuevo_usuario= async (nombreUsuario, contraseñaUsuario, emailUsuario) => {
    try {
  
     
        const response = await fetch('http://localhost:8000/app/bibilo/nuevo_usuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        
            body: JSON.stringify({
                nombre: nombreUsuario,
                contraseña: contraseñaUsuario,
                email: emailUsuario
            })
        });

        
        const resultado = await response.json();

  
        if (!response.ok) {
          
            throw new backendError(resultado.message || 'Hubo un problema al crear el usuario.');
        }

        return resultado.data;

    } catch (error) {
        const mensaje = error.message === 'Failed to fetch'
        ? 'error de comunicacion con el server'          
        : error.message;

    console.error('Error en la petición:', mensaje);
   
    throw new Error(mensaje);
    }
};
  
  