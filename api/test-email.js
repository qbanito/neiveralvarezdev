import { Resend } from 'resend';

const resend = new Resend('re_ZSteqbvY_66XiJHHH1SPdDHt9srxjNqZN');

console.log('🧪 Sending test emails with spectacular design...\n');

const testData = {
  name: 'John Smith',
  email: 'convoycubano@gmail.com',
  company: 'Tech Innovations Inc.',
  service: 'Enterprise Solutions',
  message: 'We need a scalable enterprise platform to manage our growing customer base. Looking for React/Node.js expertise with AWS deployment. Timeline: 3 months.',
  budget: '$15,000-$25,000'
};

// ADMIN EMAIL - Spectacular Design
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
              <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.5px; text-shadow: 0 2px 10px rgba(0,0,0,0.3);">
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
                    <td style="color: #ffffff; font-size: 16px; font-weight: 500;">${testData.name}</td>
                  </tr>
                  <tr>
                    <td style="color: #94a3b8; font-size: 14px; font-weight: 600;">Email:</td>
                    <td>
                      <a href="mailto:${testData.email}" style="color: #06b6d4; text-decoration: none; font-size: 16px; font-weight: 500;">
                        📧 ${testData.email}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style="color: #94a3b8; font-size: 14px; font-weight: 600;">Company:</td>
                    <td style="color: #ffffff; font-size: 16px; font-weight: 500;">🏢 ${testData.company}</td>
                  </tr>
                  <tr>
                    <td style="color: #94a3b8; font-size: 14px; font-weight: 600;">Service:</td>
                    <td style="color: #22d3ee; font-size: 16px; font-weight: 600;">🎯 ${testData.service}</td>
                  </tr>
                  <tr>
                    <td style="color: #94a3b8; font-size: 14px; font-weight: 600;">Budget:</td>
                    <td style="color: #10b981; font-size: 16px; font-weight: 700;">💰 ${testData.budget}</td>
                  </tr>
                </table>
              </div>

              <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border: 2px solid #334155; border-radius: 12px; padding: 30px; margin-bottom: 20px;">
                <h3 style="color: #06b6d4; margin: 0 0 15px 0; font-size: 18px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                  📝 Project Details
                </h3>
                <div style="background: #0f172a; border-left: 4px solid #06b6d4; border-radius: 6px; padding: 20px;">
                  <p style="color: #cbd5e1; font-size: 15px; line-height: 1.8; margin: 0;">${testData.message}</p>
                </div>
              </div>

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

// CLIENT EMAIL - Spectacular Design
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
              <div style="background: rgba(255,255,255,0.15); border: 2px solid rgba(255,255,255,0.25); border-radius: 100px; width: 80px; height: 80px; margin: 0 auto 20px;">
                <span style="color: #ffffff; font-size: 40px; font-weight: 900; display: block; line-height: 76px;">N</span>
              </div>
              <h1 style="color: #ffffff; margin: 0; font-size: 36px; font-weight: 800; letter-spacing: -1px; text-shadow: 0 2px 15px rgba(0,0,0,0.3);">
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
                Hi <strong style="color: #06b6d4;">${testData.name.split(' ')[0]}</strong>,
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
                    <td style="color: #ffffff; font-size: 15px; font-weight: 500;">${testData.service}</td>
                  </tr>
                  <tr>
                    <td style="color: #94a3b8; font-size: 14px; font-weight: 600;">Budget:</td>
                    <td style="color: #10b981; font-size: 15px; font-weight: 600;">${testData.budget}</td>
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

              <div style="background: #0f172a; border-radius: 12px; padding: 25px; margin-top: 30px; text-align: center;">
                <p style="color: #94a3b8; font-size: 14px; margin: 0 0 15px 0;">
                  While you wait, let's connect:
                </p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center">
                      <a href="https://www.linkedin.com/in/neiveralvarez/" style="display: inline-block; margin: 0 10px;">
                        <span style="font-size: 32px;">💼</span>
                      </a>
                      <a href="https://wa.me/17865432478" style="display: inline-block; margin: 0 10px;">
                        <span style="font-size: 32px;">💬</span>
                      </a>
                    </td>
                  </tr>
                </table>
              </div>

            </td>
          </tr>

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

async function sendTestEmails() {
  try {
    console.log('📧 Sending admin notification email...');
    
    const adminEmail = await resend.emails.send({
      from: 'OMNIA CRM <info@neiveralvarez.site>',
      to: 'convoycubano@gmail.com',
      subject: `🚀 NEW LEAD: ${testData.name} 💰 ${testData.budget} | ${testData.service}`,
      html: emailContent,
      replyTo: testData.email,
    });

    console.log('✅ Admin email sent:', adminEmail.id);

    console.log('\n📧 Sending client auto-response...');
    
    const clientEmail = await resend.emails.send({
      from: 'Neiver Álvarez - OMNIA <info@neiveralvarez.site>',
      to: 'convoycubano@gmail.com',
      subject: `✅ Thank You ${testData.name.split(' ')[0]} - We'll Be In Touch Soon | OMNIA`,
      html: clientEmailContent,
    });

    console.log('✅ Client email sent:', clientEmail.id);

    console.log('\n🎉 TEST COMPLETED SUCCESSFULLY!');
    console.log('\n📬 Check your inbox:');
    console.log('   Email: convoycubano@gmail.com');
    console.log('   You should receive 2 spectacular emails:');
    console.log('   1. 🚀 NEW LEAD ALERT (Admin notification)');
    console.log('   2. ✅ Thank You (Client auto-response)');
    console.log('\n⚠️  If they don\'t arrive, check your spam/promotions folder');

  } catch (error) {
    console.error('\n❌ Error sending emails:', error);
    console.error('Details:', error.message);
  }
}

sendTestEmails();
