// API endpoint para manejar contactos con Resend
import { Resend } from 'resend';

const resend = new Resend('re_ZSteqbvY_66XiJHHH1SPdDHt9srxjNqZN');

export default async function handler(req, res) {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, company, service, message, budget } = req.body;

    // Validación básica
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Crear el contenido del email
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🚀 Nuevo Lead - OMNIA</h1>
        </div>
        
        <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0;">
          <h2 style="color: #0f172a; margin-top: 0;">Información del Cliente</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 10px 0;"><strong>👤 Nombre:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>📧 Email:</strong> <a href="mailto:${email}" style="color: #06b6d4;">${email}</a></p>
            ${company ? `<p style="margin: 10px 0;"><strong>🏢 Empresa:</strong> ${company}</p>` : ''}
            ${service ? `<p style="margin: 10px 0;"><strong>🎯 Servicio:</strong> ${service}</p>` : ''}
            ${budget ? `<p style="margin: 10px 0;"><strong>💰 Presupuesto:</strong> ${budget}</p>` : ''}
          </div>

          <div style="background: white; padding: 20px; border-radius: 8px;">
            <h3 style="color: #0f172a; margin-top: 0;">📝 Mensaje</h3>
            <p style="color: #334155; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>

          <div style="margin-top: 30px; padding: 20px; background: #ecfeff; border-left: 4px solid #06b6d4; border-radius: 4px;">
            <p style="margin: 0; color: #0e7490;">
              <strong>⚡ Acción recomendada:</strong> Responder dentro de las próximas 2 horas para máxima conversión.
            </p>
          </div>
        </div>

        <div style="background: #0f172a; padding: 20px; text-align: center; color: #94a3b8;">
          <p style="margin: 5px 0; font-size: 14px;">OMNIA - Luxury Software Development</p>
          <p style="margin: 5px 0; font-size: 12px;">Recibido el ${new Date().toLocaleString('es-ES', { timeZone: 'America/New_York' })} (Miami Time)</p>
        </div>
      </div>
    `;

    // Email para el cliente (auto-respuesta)
    const clientEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Gracias por contactarnos</h1>
        </div>
        
        <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0;">
          <p style="color: #334155; font-size: 16px; line-height: 1.6;">Hola ${name},</p>
          
          <p style="color: #334155; font-size: 16px; line-height: 1.6;">
            Gracias por tu interés en OMNIA. Hemos recibido tu mensaje y nuestro equipo lo está revisando.
          </p>

          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0; color: #64748b;"><strong>📋 Resumen de tu solicitud:</strong></p>
            <p style="margin: 10px 0; color: #334155;">Servicio: ${service || 'No especificado'}</p>
            <p style="margin: 10px 0; color: #334155;">Presupuesto: ${budget || 'Por definir'}</p>
          </div>

          <p style="color: #334155; font-size: 16px; line-height: 1.6;">
            <strong>⏱️ Tiempo de respuesta:</strong> Nos pondremos en contacto contigo dentro de las próximas 24 horas.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://calendly.com/convoycubano/neiver-alvarez-dev" 
               style="display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              📅 Agenda una llamada ahora
            </a>
          </div>

          <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
            Mientras tanto, siéntete libre de explorar nuestros proyectos o conectar conmigo en 
            <a href="https://www.linkedin.com/in/neiveralvarez/" style="color: #06b6d4;">LinkedIn</a>.
          </p>
        </div>

        <div style="background: #0f172a; padding: 20px; text-align: center;">
          <p style="color: #94a3b8; margin: 10px 0; font-size: 14px;">Neiver Álvarez | CEO & Lead Architect</p>
          <p style="color: #64748b; margin: 10px 0; font-size: 12px;">
            📧 info@neiveralvarez.site | 📱 786-987-6934
          </p>
          <p style="color: #64748b; margin: 10px 0; font-size: 12px;">
            1000 Brickell Ave, Miami FL 33131
          </p>
        </div>
      </div>
    `;

    // Enviar email al admin
    const adminEmail = await resend.emails.send({
      from: 'OMNIA CRM <info@neiveralvarez.site>',
      to: ['info@neiveralvarezdev.com', 'business@neiveralvarez.dev'],
      subject: `🚀 Nuevo Lead: ${name} - ${service || 'Consulta General'}`,
      html: emailContent,
      replyTo: email,
    });

    // Enviar auto-respuesta al cliente
    const clientEmail = await resend.emails.send({
      from: 'Neiver Álvarez <info@neiveralvarez.site>',
      to: email,
      subject: '✅ Confirmación - Hemos recibido tu mensaje | OMNIA',
      html: clientEmailContent,
    });

    // Guardar lead en localStorage (para tracking interno)
    const leadData = {
      id: Date.now(),
      name,
      email,
      company,
      service,
      message,
      budget,
      status: 'new',
      createdAt: new Date().toISOString(),
      emailSent: true,
    };

    console.log('✅ Lead guardado:', leadData);

    return res.status(200).json({
      success: true,
      message: 'Emails sent successfully',
      leadId: leadData.id,
    });

  } catch (error) {
    console.error('❌ Error sending email:', error);
    return res.status(500).json({
      error: 'Failed to send email',
      details: error.message,
    });
  }
}
