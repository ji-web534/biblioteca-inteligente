import { resend } from "../../config/email_config.js"
import ENVIRONMENT from "../../config/environment.js"
import jwt from "jsonwebtoken"

async function enviarEmailCambioContraseña(nombreUsuario, emailDestino) {
  try {
    const token = jwt.sign(
      { email: emailDestino },
      ENVIRONMENT.JWT_SECRET,
      { expiresIn: '1h' }
    )

    let baseUrl = "http://localhost:5173"
    if (ENVIRONMENT.URL_FRONTEND) {
        try { baseUrl = new URL(ENVIRONMENT.URL_FRONTEND).origin } catch {}
    }
    const enlaceCambio = `${baseUrl}/cambiar-contrasena?token=${token}`

    console.log("URL generada para el email:", enlaceCambio)

    const { data, error } = await resend.emails.send({
      from: 'Biblioteca Inteligente <onboarding@resend.dev>',
      to: emailDestino,
      subject: `Solicitud de cambio de contraseña - Biblioteca Inteligente`,
      html: `
        <div style="background-color: #cc0000; color: white; font-family: Arial, sans-serif; text-align: center; padding: 80px 40px; min-height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <h1 style="font-size: 48px; margin: 0 0 20px; text-transform: uppercase; letter-spacing: 4px;">MAIL NUEVO</h1>
          <p style="font-size: 18px; margin: 0 0 30px; opacity: 0.9;">Hola, <strong>${nombreUsuario}</strong>. Recibimos una solicitud para restablecer tu contraseña.</p>
          <a href="${enlaceCambio}" style="background-color: white; color: #cc0000; padding: 16px 40px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 18px; display: inline-block;">Restablecer contraseña</a>
          <p style="font-size: 13px; margin-top: 30px; opacity: 0.7;">Si el botón no funciona: <a href="${enlaceCambio}" style="color: white;">${enlaceCambio}</a></p>
          <p style="font-size: 12px; margin-top: 20px; opacity: 0.5;">Este enlace expira en 1 hora. Si no solicitaste este cambio, ignorá este mensaje.</p>
        </div>`,
    })

    if (error) {
      console.error("Error al enviar correo de cambio de contraseña:", error)
      throw new Error(error.message)
    }
    console.log("Correo de cambio de contraseña enviado. ID:", data.id)
    return { success: true, id: data.id }

  } catch (error) {
    console.error("Error al enviar correo de cambio de contraseña:", error)
    throw error
  }
}

export default enviarEmailCambioContraseña
