import { resend } from "../../config/email_config.js";
import ENVIRONMENT from "../../config/environment.js";
import USUARIO from "../esquemas/esquema_usuario.js";

import { Router } from "express";
import jwt from "jsonwebtoken";
const router = Router();
router.get("/", async (nombreUsuario, emailDestino, next) => {
  try {
// creamo un token cifrado con expiracion a una hora
const TOKEN = jwt.sign(
  { emailDestino: emailDestino },
  ENVIRONMENT.JWT_SECRET,
  { expiresIn: '1h' }
);

// enlaces usando environments
const urlFrontend = ENVIRONMENT.URL_FRONTEND ?? "http://localhost:5173";
const enlaceVerificacion = `${urlFrontend}/confirmar-cuenta?token=${TOKEN}`;

// mandamos el mail con la url y el token
const data = await resend.emails.send({
  from: 'Biblioteca Inteligente <onboarding@resend.dev>', 
  to: emailDestino, 
  subject: `¡Hola ${nombreUsuario}, gracias por registrarte en mi proyecto!`,
  html: `
    <div style="font-family: sans-serif; padding: 30px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px;">
      <h1 style="color: #4f46e5; font-size: 24px; text-align: center;">¡Hola, ${nombreUsuario}! 🚀</h1>
      
      <p style="font-size: 16px; line-height: 1.5; text-align: center;">
        Gracias por registrarte en la <strong>Biblioteca Inteligente</strong>. Para poder activar tu cuenta y empezar a catalogar tus obras, necesitamos que confirmes tu dirección de correo electrónico.
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${enlaceVerificacion}" 
           style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);">
           Verificar mi cuenta
        </a>
      </div>
      
      <p style="font-size: 14px; color: #555; text-align: center;">
        Si el botón no funciona, podés copiar y pegar este enlace en tu navegador:<br />
        <a href="${enlaceVerificacion}" style="color: #4f46e5; word-break: break-all;">${enlaceVerificacion}</a>
      </p>
      
      <hr style="border: 0; border-top: 1px solid #eee; margin: 25px 0;" />
      
      <p style="font-size: 12px; color: #888; text-align: center; margin-bottom: 0;">
        Este es un correo automático enviado desde la Biblioteca Inteligente utilizando <strong>Resend</strong>.<br />
        Si no creaste esta cuenta, podés ignorar este mail con total seguridad.
      </p>
    </div> `,
});
   

    console.log("Correo enviado con éxito. ID del mensaje:", data.id);
    return { success: true, id: data.id };
    
  } catch (error) {
    console.error("Error interno en Resend:", error);
    throw error; 
  }
});
export default router;