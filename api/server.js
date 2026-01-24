import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Configurar Resend
const resend = new Resend('re_ZSteqbvY_66XiJHHH1SPdDHt9srxjNqZN');

// Middleware
app.use(cors());
app.use(express.json());

// Archivo para guardar leads
const LEADS_FILE = path.join(__dirname, 'leads.json');

// Función para cargar leads
function loadLeads() {
  try {
    if (fs.existsSync(LEADS_FILE)) {
      const data = fs.readFileSync(LEADS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading leads:', error);
  }
  return [];
}

// Función para guardar leads
function saveLeads(leads) {
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
  } catch (error) {
    console.error('Error saving leads:', error);
  }
}

// Endpoint para enviar contacto
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, company, service, message, budget } = req.body;

    // Validación
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    console.log('📧 Procesando nuevo lead:', { name, email, service });

    // Crear el contenido del email para admin
    const emailContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Lead - OMNIA</title>
      </head>
      <body style="margin: 0; padding: 0; background: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #0f172a; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background: #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
                
                <!-- Header with Gradient -->
                <tr>
                  <td style="background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.5px; text-shadow: 0 2px 10px rgba(0,0,0,0.3);">
                      🚀 NEW LEAD ALERT
                    </h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px; font-weight: 500;">
                      OMNIA - Elite Digital Engineering
                    </p>
                  </td>
                </tr>

                <!-- Client Information Card -->
                <tr>
                  <td style="padding: 40px 30px; background: #1e293b;">
                    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border: 2px solid #334155; border-radius: 12px; padding: 30px; margin-bottom: 20px;">
                      <h2 style="color: #06b6d4; margin: 0 0 20px 0; font-size: 20px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #334155; padding-bottom: 15px;">
                        👤 Client Information
                      </h2>
                      
                      <table width="100%" cellpadding="8" cellspacing="0">
                        <tr>
                          <td style="color: #94a3b8; font-size: 14px; font-weight: 600; width: 140px;">Full Name:</td>
                          <td style="color: #ffffff; font-size: 16px; font-weight: 500;">${name}</td>
                        </tr>
                        <tr>
                          <td style="color: #94a3b8; font-size: 14px; font-weight: 600;">Email Address:</td>
                          <td>
                            <a href="mailto:${email}" style="color: #06b6d4; text-decoration: none; font-size: 16px; font-weight: 500; display: inline-flex; align-items: center;">
                              📧 ${email}
                            </a>
                          </td>
                        </tr>
                        ${company ? `
                        <tr>
                          <td style="color: #94a3b8; font-size: 14px; font-weight: 600;">Company:</td>
                          <td style="color: #ffffff; font-size: 16px; font-weight: 500;">🏢 ${company}</td>
                        </tr>` : ''}
                        ${service ? `
                        <tr>
                          <td style="color: #94a3b8; font-size: 14px; font-weight: 600;">Service:</td>
                          <td style="color: #22d3ee; font-size: 16px; font-weight: 600;">🎯 ${service}</td>
                        </tr>` : ''}
                        ${budget ? `
                        <tr>
                          <td style="color: #94a3b8; font-size: 14px; font-weight: 600;">Budget:</td>
                          <td style="color: #10b981; font-size: 16px; font-weight: 700;">💰 ${budget}</td>
                        </tr>` : ''}
                      </table>
                    </div>

                    <!-- Message Card -->
                    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border: 2px solid #334155; border-radius: 12px; padding: 30px; margin-bottom: 20px;">
                      <h3 style="color: #06b6d4; margin: 0 0 15px 0; font-size: 18px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                        📝 Project Details
                      </h3>
                      <div style="background: #0f172a; border-left: 4px solid #06b6d4; border-radius: 6px; padding: 20px;">
                        <p style="color: #cbd5e1; font-size: 15px; line-height: 1.8; margin: 0; white-space: pre-wrap;">${message}</p>
                      </div>
                    </div>

                    <!-- Action Card -->
                    <div style="background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); border-radius: 12px; padding: 25px; text-align: center; box-shadow: 0 10px 30px rgba(6, 182, 212, 0.3);">
                      <p style="color: #ffffff; margin: 0 0 10px 0; font-size: 16px; font-weight: 700;">
                        ⚡ QUICK ACTION REQUIRED
                      </p>
                      <p style="color: rgba(255,255,255,0.95); margin: 0; font-size: 14px; line-height: 1.6;">
                        Respond within <strong>2 hours</strong> for maximum conversion rate.<br/>
                        High-value leads convert 73% faster with immediate response.
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background: #0f172a; padding: 30px; text-align: center; border-top: 1px solid #334155;">
                    <p style="color: #94a3b8; margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">
                      OMNIA - Elite Digital Engineering
                    </p>
                    <p style="color: #64748b; margin: 0; font-size: 12px;">
                      Lead received on ${new Date().toLocaleString('en-US', { 
                        timeZone: 'America/New_York',
                        dateStyle: 'full',
                        timeStyle: 'short'
                      })} (Miami Time)
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Auto-respuesta para el cliente
    const clientEmailContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You - OMNIA</title>
      </head>
      <body style="margin: 0; padding: 0; background: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #0f172a; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background: #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
                
                <!-- Header with Gradient & Logo -->
                <tr>
                  <td style="background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%); padding: 50px 30px; text-align: center; position: relative;">
                    <div style="background: rgba(255,255,255,0.1); border: 2px solid rgba(255,255,255,0.2); border-radius: 100px; width: 80px; height: 80px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                      <span style="color: #ffffff; font-size: 40px; font-weight: 900;">N</span>
                    </div>
                    <h1 style="color: #ffffff; margin: 0; font-size: 36px; font-weight: 800; letter-spacing: -1px; text-shadow: 0 2px 15px rgba(0,0,0,0.3);">
                      Thank You!
                    </h1>
                    <p style="color: rgba(255,255,255,0.95); margin: 15px 0 0 0; font-size: 18px; font-weight: 500;">
                      We've received your message
                    </p>
                  </td>
                </tr>

                <!-- Welcome Message -->
                <tr>
                  <td style="padding: 40px 30px; background: #1e293b;">
                    <p style="color: #ffffff; font-size: 18px; line-height: 1.8; margin: 0 0 20px 0;">
                      Hi <strong style="color: #06b6d4;">${name}</strong>,
                    </p>
                    
                    <p style="color: #cbd5e1; font-size: 16px; line-height: 1.8; margin: 0 0 25px 0;">
                      Thank you for reaching out to <strong style="color: #06b6d4;">OMNIA</strong>. We're excited about the possibility of working together on your project!
                    </p>

                    <p style="color: #cbd5e1; font-size: 16px; line-height: 1.8; margin: 0 0 30px 0;">
                      Your inquiry is important to us, and our team is already reviewing the details you provided.
                    </p>

                    <!-- Request Summary Card -->
                    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border: 2px solid #334155; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
                      <h3 style="color: #06b6d4; margin: 0 0 20px 0; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                        📋 Your Request Summary
                      </h3>
                      <table width="100%" cellpadding="8" cellspacing="0">
                        <tr>
                          <td style="color: #94a3b8; font-size: 14px; font-weight: 600; width: 120px;">Service:</td>
                          <td style="color: #ffffff; font-size: 15px; font-weight: 500;">${service || 'General Inquiry'}</td>
                        </tr>
                        <tr>
                          <td style="color: #94a3b8; font-size: 14px; font-weight: 600;">Budget:</td>
                          <td style="color: #10b981; font-size: 15px; font-weight: 600;">${budget || 'To be discussed'}</td>
                        </tr>
                      </table>
                    </div>

                    <!-- What Happens Next -->
                    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-left: 4px solid #06b6d4; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
                      <h3 style="color: #06b6d4; margin: 0 0 15px 0; font-size: 16px; font-weight: 700;">
                        ⏱️ What Happens Next?
                      </h3>
                      <ul style="color: #cbd5e1; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                        <li style="margin-bottom: 10px;">Our team will review your project requirements</li>
                        <li style="margin-bottom: 10px;">We'll prepare a preliminary assessment</li>
                        <li style="margin-bottom: 10px;"><strong style="color: #10b981;">You'll hear from us within 24 hours</strong></li>
                      </ul>
                    </div>

                    <!-- CTA Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 20px 0;">
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); border-radius: 50px; padding: 18px 40px; box-shadow: 0 10px 30px rgba(6, 182, 212, 0.4);">
                                <a href="https://calendly.com/convoycubano/neiver-alvarez-dev" style="color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 700; display: inline-block;">
                                  📅 Schedule a Call Now
                                </a>
                              </td>
                            </tr>
                          </table>
                          <p style="color: #94a3b8; font-size: 13px; margin: 15px 0 0 0;">
                            Want faster results? Book a consultation directly!
                          </p>
                        </td>
                      </tr>
                    </table>

                    <!-- Social Connect -->
                    <div style="background: #0f172a; border-radius: 12px; padding: 25px; margin-top: 30px; text-align: center;">
                      <p style="color: #94a3b8; font-size: 14px; margin: 0 0 15px 0;">
                        While you wait, let's connect:
                      </p>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center">
                            <a href="https://www.linkedin.com/in/neiveralvarez/" style="display: inline-block; margin: 0 10px;">
                              <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" width="32" height="32" style="border-radius: 6px;">
                            </a>
                            <a href="https://wa.me/17865432478" style="display: inline-block; margin: 0 10px;">
                              <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="WhatsApp" width="32" height="32" style="border-radius: 6px;">
                            </a>
                          </td>
                        </tr>
                      </table>
                    </div>

                  </td>
                </tr>

                <!-- Footer with Contact Info -->
                <tr>
                  <td style="background: #0f172a; padding: 30px; border-top: 1px solid #334155;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <p style="color: #06b6d4; margin: 0 0 15px 0; font-size: 18px; font-weight: 700; letter-spacing: 1px;">
                            OMNIA
                          </p>
                          <p style="color: #94a3b8; margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">
                            Neiver Álvarez | CEO & Lead Architect
                          </p>
                          <p style="color: #64748b; margin: 0 0 5px 0; font-size: 13px;">
                            📧 info@neiveralvarez.site | 📱 +1 (786) 987-6934
                          </p>
                          <p style="color: #64748b; margin: 0; font-size: 13px;">
                            📍 1000 Brickell Ave, Miami FL 33131
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Enviar email al admin
    await resend.emails.send({
      from: 'OMNIA CRM <info@neiveralvarez.site>',
      to: ['convoycubano@gmail.com', 'info@neiveralvarezdev.com', 'business@neiveralvarez.dev'],
      subject: `🚀 NEW LEAD: ${name} ${budget ? '💰 ' + budget : ''} | ${service || 'General Inquiry'}`,
      html: emailContent,
      replyTo: email,
    });

    // Enviar auto-respuesta al cliente
    await resend.emails.send({
      from: 'Neiver Álvarez - OMNIA <info@neiveralvarez.site>',
      to: email,
      subject: `✅ Thank You ${name.split(' ')[0]} - We'll Be In Touch Soon | OMNIA`,
      html: clientEmailContent,
    });

    // Guardar lead en archivo JSON
    const leads = loadLeads();
    const newLead = {
      id: Date.now(),
      name,
      email,
      company: company || '',
      service: service || '',
      message,
      budget: budget || '',
      status: 'new',
      createdAt: new Date().toISOString(),
      emailSent: true,
    };
    leads.push(newLead);
    saveLeads(leads);

    console.log('✅ Lead guardado y emails enviados:', newLead.id);

    res.status(200).json({
      success: true,
      message: 'Mensaje enviado exitosamente',
      leadId: newLead.id,
    });

  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({
      error: 'Error al enviar el mensaje',
      details: error.message,
    });
  }
});

// Endpoint para ver leads (CRM simple)
app.get('/api/leads', (req, res) => {
  const leads = loadLeads();
  res.json({
    total: leads.length,
    leads: leads.reverse(), // Más recientes primero
  });
});

// Endpoint para actualizar status de lead
app.patch('/api/leads/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const leads = loadLeads();
  const leadIndex = leads.findIndex(l => l.id === parseInt(id));
  
  if (leadIndex === -1) {
    return res.status(404).json({ error: 'Lead no encontrado' });
  }
  
  leads[leadIndex].status = status;
  leads[leadIndex].updatedAt = new Date().toISOString();
  saveLeads(leads);
  
  res.json({ success: true, lead: leads[leadIndex] });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'OMNIA CRM API' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 OMNIA CRM API corriendo en http://localhost:${PORT}`);
  console.log(`📧 Email: info@neiveralvarez.site`);
  console.log(`💾 Leads guardados en: ${LEADS_FILE}\n`);
});
