import nodemailer from 'nodemailer';

// Configuración del servicio de correo
// NOTA: Para Gmail necesitas crear una "Contraseña de Aplicación" (App Password)
// Si no quieres complicarte, usaremos Ethereal (un servicio fake para pruebas)
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'e5kewinuwz32tqa3@ethereal.email', // Usuario de prueba (Cámbialo si tienes uno propio)
    pass: 'bpJvs9Zf2nm3M7RP1y' // Password de prueba
  }
});

// FUNCIÓN PARA ENVIAR EL CORREO
export const enviarNotificacion = async (emailUsuario, nombreUsuario, estado, lugar, fecha, horario) => {
  try {
    let asunto = "";
    let mensajeHtml = "";

    if (estado === 'aprobado') {
        asunto = "✅ ¡Solicitud Aprobada! - FastEmergency";
        mensajeHtml = `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 3px solid #059669; border-radius: 10px;">
                <h1 style="color: #059669;">¡Felicidades, ${nombreUsuario}!</h1>
                <p>Tu solicitud de voluntariado ha sido aceptada.</p>
                <hr/>
                <h3>Detalles de tu turno:</h3>
                <ul>
                    <li><strong>Lugar Asignado:</strong> ${lugar}</li>
                    <li><strong>Fecha:</strong> ${fecha}</li>
                    <li><strong>Horario:</strong> ${horario}</li>
                </ul>
                <p style="background: #ecfdf5; padding: 10px; border-left: 5px solid #059669;">
                    Por favor preséntate 15 minutos antes con tu cédula de identidad.
                </p>
            </div>
        `;
    } else {
        asunto = "❌ Actualización de Solicitud - FastEmergency";
        mensajeHtml = `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 3px solid #dc2626; border-radius: 10px;">
                <h1 style="color: #dc2626;">Hola, ${nombreUsuario}</h1>
                <p>Lamentablemente, tu solicitud para el día <strong>${fecha}</strong> no pudo ser aceptada en esta ocasión.</p>
                <p>Esto puede deberse a falta de cupos o cambios en la planificación.</p>
                <p>¡Te invitamos a postular en otra fecha!</p>
            </div>
        `;
    }

    // Enviar el correo
    const info = await transporter.sendMail({
      from: '"Coordinación FastEmergency" <no-reply@fastemergency.cl>',
      to: emailUsuario,
      subject: asunto,
      html: mensajeHtml,
    });

    console.log("Mensaje enviado: %s", info.messageId);
    // ESTO ES IMPORTANTE: Ethereal te da un link para ver el correo simulado
    console.log("Vista previa URL: %s", nodemailer.getTestMessageUrl(info));

  } catch (error) {
    console.error("Error enviando correo:", error);
  }
};