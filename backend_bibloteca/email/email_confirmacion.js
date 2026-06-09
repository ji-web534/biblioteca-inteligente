import USUARIO from "../src/esquemas/esquema_usuario.js";
import { resend } from "./config/resend.js"; // Importas tu instancia configurada

export const enviarCorreoBienvenida = async (emailDestino, nombreUsuario) => {
  try {
    jwt.sing({
      emailDestino : emailDestino
    })
    const data = await resend.emails.send({
     
      from: 'Mi Portafolio <onboarding@resend.dev>', 
      
      
      to: emailDestino, 
      
    
      subject: `¡Hola ${nombreUsuario}, gracias por visitar mi proyecto!`,
      
      
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h1 style="color: #4f46e5;">¡Hola, ${nombreUsuario}! 🚀</h1>
          <p>Este es un correo automático enviado desde mi aplicación de portafolio utilizando <strong>Resend</strong>.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">Backend de pruebas - Fullstack Developer</p>
        </div>
      `,
    });

    console.log("Correo enviado con éxito. ID del mensaje:", data.id);
    return { success: true, id: data.id };
    
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    return { success: false, error };
  }
};