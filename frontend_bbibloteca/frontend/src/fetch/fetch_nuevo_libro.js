export const crearLibro = async (nombreLibro, descripcionLibro) => {
    try {
  
     
        const response = await fetch('http://localhost:8000/app/bibilo', {
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
          
            throw new Error(resultado.message || 'Hubo un problema al crear el libro.');
        }

      
        console.log('¡Éxito!:', resultado.message);
        console.log('Datos del libro guardado:', resultado.data);
        
        return resultado.data;

    } catch (error) {
     
        console.error('Error en la petición:', error.message);
        alert(error.message);
    }
};
  
  
  
  

