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

    const urlFrontend = ENVIRONMENT.URL_FRONTEND ?? "http://localhost:5173"
    const enlaceCambio = `${urlFrontend}/cambiar-contrasena?token=${token}`

    const data = await resend.emails.send({
      from: 'Biblioteca Inteligente <onboarding@resend.dev>',
      to: emailDestino,
      subject: `Solicitud de cambio de contraseña - Biblioteca Inteligente`,
      html: `
        <div style="font-family: Georgia, serif; padding: 40px 30px; max-width: 560px; margin: 0 auto; background-color: #faf6f0; border-radius: 12px; border: 1px solid #e8ddd0;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #7a5c3a; font-size: 22px; margin: 0;">Biblioteca Inteligente</h1>
            <hr style="border: 0; border-top: 2px solid #d4c5b2; width: 60px; margin: 12px auto;" />
          </div>

          <p style="color: #5c4a3a; font-size: 16px; line-height: 1.6;">Hola, <strong>${nombreUsuario}</strong>.</p>

          <p style="color: #5c4a3a; font-size: 15px; line-height: 1.6;">
            Recibimos una solicitud para restablecer la contraseña de tu cuenta.
            Si fuiste vos, hace clic en el siguiente botón para continuar:
          </p>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${enlaceCambio}"
               style="background-color: #8b6f4e; color: #faf6f0; padding: 14px 32px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block; font-size: 15px; letter-spacing: 0.5px;">
               Restablecer contraseña
            </a>
          </div>

          <p style="color: #7a6a5a; font-size: 13px; line-height: 1.5; text-align: center;">
            Si el botón no funciona, copiá y pegá este enlace en tu navegador:<br />
            <a href="${enlaceCambio}" style="color: #8b6f4e; word-break: break-all; font-size: 12px;">${enlaceCambio}</a>
          </p>

          <p style="color: #7a6a5a; font-size: 13px; line-height: 1.5; text-align: center; margin-top: 24px;">
            Este enlace expira en <strong>1 hora</strong>. Si no solicitaste este cambio, ignorá este mensaje.
          </p>

          <hr style="border: 0; border-top: 1px solid #e8ddd0; margin: 30px 0 20px;" />

          <p style="color: #a09080; font-size: 12px; text-align: center; margin: 0;">
            Biblioteca Inteligente &mdash; correo automático, no responder.
          </p>
        </div>`,
    })

    console.log("Correo de cambio de contraseña enviado. ID:", data.id)
    return { success: true, id: data.id }

  } catch (error) {
    console.error("Error al enviar correo de cambio de contraseña:", error)
    throw error
  }
}

export default enviarEmailCambioContraseña
