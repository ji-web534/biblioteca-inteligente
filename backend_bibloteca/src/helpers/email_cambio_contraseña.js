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
        <div style="background: linear-gradient(180deg, #f3ecdf 0%, #e8decb 100%); font-family: 'Lora', Georgia, 'Times New Roman', serif; text-align: center; padding: 60px 40px; min-height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <h1 style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 42px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 6px; color: #3f2a20;">Biblioteca</h1>
          <p style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 20px; margin: 0 0 32px; color: #8b7355; font-style: italic;">Restablecer contraseña</p>
          <hr style="border: none; border-top: 1px solid #c9b89a; width: 80px; margin: 0 0 32px;">
          <p style="font-size: 16px; margin: 0 0 28px; color: #2a2118; line-height: 1.6;">Hola, <strong style="color: #5c3d2e;">${nombreUsuario}</strong>. Recibimos una solicitud para restablecer tu contraseña. Hacé clic en el botón de abajo para continuar.</p>
          <a href="${enlaceCambio}" style="display: inline-block; padding: 14px 36px; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 18px; font-weight: 600; letter-spacing: 0.04em; text-decoration: none; color: #f3ecdf; background: linear-gradient(180deg, #5c3d2e 0%, #3f2a20 100%); border: 1px solid #3f2a20; border-radius: 0;">Restablecer contraseña</a>
          <p style="font-size: 13px; margin-top: 36px; color: #4a3f32;">Si el botón no funciona, copiá este enlace en tu navegador:</p>
          <p style="font-size: 12px; margin-top: 4px; color: #8b7355; word-break: break-all;">${enlaceCambio}</p>
          <hr style="border: none; border-top: 1px solid #c9b89a; width: 80px; margin: 32px 0 20px;">
          <p style="font-size: 12px; margin: 0; color: #4a3f32; opacity: 0.7;">Este enlace expira en 1 hora. Si no solicitaste este cambio, ignorá este mensaje.</p>
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
