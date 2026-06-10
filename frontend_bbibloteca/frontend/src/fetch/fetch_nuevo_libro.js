
import { backendError } from "../helpers/error_class";

export const crearLibro = async (nombreLibro, descripcionLibro) => {
    try {
  
     
        const response = await fetch('http://localhost:8000/app/bibilo/nuevo_libro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        
            body: JSON.stringify({
                nombre: nombreLibro,
                descripcion: descripcionLibro
            })
        });

        
        const resultado = await response.json();

  
        if (!response.ok) {
          
            throw new backendError(resultado.message || 'Hubo un problema al crear el libro.');
        }

      
        console.log('¡Éxito!:', resultado.message);
        console.log('Datos del libro guardado:', resultado.data);
        
        return resultado.data;

    } catch (error) {
        const mensaje = error.message === 'Failed to fetch'
            ? 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo en el puerto 8000.'
            : error.message

        console.error('Error en la petición:', mensaje)
        alert(mensaje)
    }
};
  
  export default crearLibro;
  
  

