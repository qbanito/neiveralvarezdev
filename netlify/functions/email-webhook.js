// Webhook handler for Resend email events
// Receives notifications when leads reply, open, click, etc.

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FORWARD_TO = 'convoycubano@gmail.com';
const FROM_EMAIL = 'info@neiveralvarez.site';

export async function handler(event, context) {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const payload = JSON.parse(event.body);
    const { type, data } = payload;

    console.log(`📨 Webhook received: ${type}`);
    console.log('Data:', JSON.stringify(data, null, 2));

    // Handle different event types
    switch (type) {
      case 'email.delivered':
        console.log(`✅ Email delivered to: ${data.to}`);
        break;

      case 'email.opened':
        console.log(`👀 Email opened by: ${data.to}`);
        break;

      case 'email.clicked':
        console.log(`🖱️ Link clicked by: ${data.to}`);
        break;

      case 'email.bounced':
        console.log(`⚠️ Email bounced: ${data.to}`);
        // Notify about bounce
        await notifyBounce(data);
        break;

      case 'email.complained':
        console.log(`🚨 Spam complaint from: ${data.to}`);
        // Notify about complaint
        await notifyComplaint(data);
        break;

      // This is the main one - when someone REPLIES
      case 'email.replied':
        console.log(`🎉 REPLY received from: ${data.from}`);
        await forwardReplyToGmail(data);
        break;

      default:
        console.log(`ℹ️ Unhandled event type: ${type}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true, type })
    };

  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}

// Forward reply email to Gmail
async function forwardReplyToGmail(data) {
  const { from, to, subject, text, html, email_id } = data;
  
  console.log(`📧 Forwarding reply from ${from} to ${FORWARD_TO}`);

  const forwardHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f4f4f5; }
    .container { max-width: 600px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .header p { margin: 10px 0 0; opacity: 0.9; }
    .content { background: white; padding: 30px; }
    .info-box { background: #f0fdf4; border-left: 4px solid #10b981; padding: 15px 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
    .info-box p { margin: 5px 0; color: #166534; }
    .reply-box { background: #f9fafb; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .reply-box pre { white-space: pre-wrap; word-wrap: break-word; margin: 0; font-family: inherit; }
    .cta { text-align: center; margin: 25px 0; }
    .cta a { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 New Lead Reply!</h1>
      <p>Someone responded to your outreach campaign</p>
    </div>
    
    <div class="content">
      <div class="info-box">
        <p><strong>From:</strong> ${from}</p>
        <p><strong>Subject:</strong> ${subject || '(No subject)'}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}</p>
      </div>
      
      <h3 style="color: #374151; margin-bottom: 10px;">Their Reply:</h3>
      <div class="reply-box">
        ${html || `<pre>${text || '(Empty message)'}</pre>`}
      </div>
      
      <div class="cta">
        <a href="mailto:${from}?subject=Re: ${encodeURIComponent(subject || '')}">
          ↩️ Reply to ${from}
        </a>
      </div>
    </div>
    
    <div class="footer">
      <p>This reply was automatically forwarded from your outreach system.</p>
      <p>Original email ID: ${email_id || 'N/A'}</p>
    </div>
  </div>
</body>
</html>
  `;

  try {
    await resend.emails.send({
      from: `Lead Notification <${FROM_EMAIL}>`,
      to: FORWARD_TO,
      subject: `🎉 REPLY: ${from} - ${subject || 'New Response'}`,
      html: forwardHtml,
      replyTo: from
    });

    console.log(`✅ Reply successfully forwarded to ${FORWARD_TO}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to forward reply:', error);
    throw error;
  }
}

// Notify about bounce
async function notifyBounce(data) {
  const { to, bounce_type } = data;
  
  try {
    await resend.emails.send({
      from: `System Alert <${FROM_EMAIL}>`,
      to: FORWARD_TO,
      subject: `⚠️ Email Bounced: ${to}`,
      html: `
        <h2>Email Bounce Alert</h2>
        <p><strong>Email:</strong> ${to}</p>
        <p><strong>Bounce Type:</strong> ${bounce_type || 'Unknown'}</p>
        <p>This email has been marked as invalid and removed from future campaigns.</p>
      `
    });
  } catch (error) {
    console.error('Failed to send bounce notification:', error);
  }
}

// Notify about spam complaint
async function notifyComplaint(data) {
  const { to } = data;
  
  try {
    await resend.emails.send({
      from: `System Alert <${FROM_EMAIL}>`,
      to: FORWARD_TO,
      subject: `🚨 SPAM Complaint: ${to}`,
      html: `
        <h2 style="color: #dc2626;">⚠️ Spam Complaint Received</h2>
        <p><strong>Email:</strong> ${to}</p>
        <p>This person marked your email as spam. They have been:</p>
        <ul>
          <li>Removed from all future campaigns</li>
          <li>Added to the unsubscribe list</li>
        </ul>
        <p style="color: #6b7280;">Monitor your spam rate to maintain email deliverability.</p>
      `
    });
  } catch (error) {
    console.error('Failed to send complaint notification:', error);
  }
}
