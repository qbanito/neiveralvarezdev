import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_ZSteqbvY_66XiJHHH1SPdDHt9srxjNqZN');

export async function handler(event, context) {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { name, email, company, service, message, budget } = JSON.parse(event.body);

    // Validación
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Faltan campos requeridos' })
      };
    }

    console.log('📧 Procesando nuevo lead:', { name, email, service });

    // Email para admin
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
                <tr>
                  <td style="background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.5px;">
                      🚀 NEW LEAD ALERT
                    </h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px; font-weight: 500;">
                      OMNIA - Elite Digital Engineering
                    </p>
                  </td>
                </tr>
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
                            <a href="mailto:${email}" style="color: #06b6d4; text-decoration: none; font-size: 16px; font-weight: 500;">
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
                    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border: 2px solid #334155; border-radius: 12px; padding: 30px; margin-bottom: 20px;">
                      <h3 style="color: #06b6d4; margin: 0 0 15px 0; font-size: 18px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                        📝 Project Details
                      </h3>
                      <div style="background: #0f172a; border-left: 4px solid #06b6d4; border-radius: 6px; padding: 20px;">
                        <p style="color: #cbd5e1; font-size: 15px; line-height: 1.8; margin: 0; white-space: pre-wrap;">${message}</p>
                      </div>
                    </div>
                    <div style="background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); border-radius: 12px; padding: 25px; text-align: center;">
                      <p style="color: #ffffff; margin: 0 0 10px 0; font-size: 16px; font-weight: 700;">
                        ⚡ QUICK ACTION REQUIRED
                      </p>
                      <p style="color: rgba(255,255,255,0.95); margin: 0; font-size: 14px; line-height: 1.6;">
                        Respond within <strong>2 hours</strong> for maximum conversion rate.
                      </p>
                    </div>
                  </td>
                </tr>
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
                <tr>
                  <td style="background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%); padding: 50px 30px; text-align: center;">
                    <div style="background: rgba(255,255,255,0.1); border: 2px solid rgba(255,255,255,0.2); border-radius: 100px; width: 80px; height: 80px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                      <span style="color: #ffffff; font-size: 40px; font-weight: 900;">N</span>
                    </div>
                    <h1 style="color: #ffffff; margin: 0; font-size: 36px; font-weight: 800; letter-spacing: -1px;">
                      Thank You!
                    </h1>
                    <p style="color: rgba(255,255,255,0.95); margin: 15px 0 0 0; font-size: 18px; font-weight: 500;">
                      We've received your message
                    </p>
                  </td>
                </tr>
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
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 20px 0;">
                          <a href="https://calendly.com/convoycubano/neiver-alvarez-dev" style="display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                            📅 Schedule a Call Now
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="background: #0f172a; padding: 30px; text-align: center; border-top: 1px solid #334155;">
                    <p style="color: #94a3b8; margin: 0 0 15px 0; font-size: 14px; font-weight: 600;">
                      OMNIA - Elite Digital Engineering
                    </p>
                    <p style="color: #64748b; margin: 0; font-size: 12px;">
                      Miami, FL | neiveralvarez.site
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

    // Enviar email al admin
    const adminEmail = await resend.emails.send({
      from: 'OMNIA Leads <leads@neiveralvarez.site>',
      to: ['info@neiveralvarez.site'],
      subject: `🚀 New Lead: ${name} - ${service || 'General Inquiry'}`,
      html: emailContent,
    });

    console.log('✅ Email enviado a admin:', adminEmail);

    // Enviar auto-respuesta al cliente
    const clientEmail = await resend.emails.send({
      from: 'Neiver Alvarez <hello@neiveralvarez.site>',
      to: [email],
      subject: `Thank you for contacting OMNIA, ${name}!`,
      html: clientEmailContent,
    });

    console.log('✅ Auto-respuesta enviada a cliente:', clientEmail);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Lead received successfully',
        leadId: `lead_${Date.now()}`
      })
    };

  } catch (error) {
    console.error('❌ Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Error processing request',
        details: error.message 
      })
    };
  }
}
