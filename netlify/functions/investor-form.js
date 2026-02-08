import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_ZSteqbvY_66XiJHHH1SPdDHt9srxjNqZN');
const CALENDLY_LINK = 'https://calendly.com/convoycubano1/30min';

export async function handler(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { name, email, phone, company, investmentRange, timeline, experience, interests, goals, questions } = JSON.parse(event.body);

    if (!name || !email) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Name and email are required' }) };
    }

    console.log('💼 New investor inquiry:', { name, email, investmentRange });

    // ─── Admin notification email ───
    const adminHtml = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 20px;">
<tr><td align="center">
<table width="620" cellpadding="0" cellspacing="0" style="background:#1e293b;border-radius:16px;overflow:hidden;box-shadow:0 25px 80px rgba(0,0,0,0.6);">

<!-- Header -->
<tr><td style="background:linear-gradient(135deg,#06b6d4 0%,#3b82f6 50%,#8b5cf6 100%);padding:45px 30px;text-align:center;">
  <div style="background:rgba(255,255,255,0.15);border:2px solid rgba(255,255,255,0.3);border-radius:100px;width:70px;height:70px;margin:0 auto 15px;line-height:70px;">
    <span style="color:#fff;font-size:32px;">💼</span>
  </div>
  <h1 style="color:#fff;margin:0;font-size:28px;font-weight:800;letter-spacing:-0.5px;">NEW INVESTOR INQUIRY</h1>
  <p style="color:rgba(255,255,255,0.9);margin:10px 0 0;font-size:15px;">OMNIA — Strategic Investment Program</p>
</td></tr>

<!-- Body -->
<tr><td style="padding:35px 30px;background:#1e293b;">

  <!-- Contact Info -->
  <div style="background:#0f172a;border:2px solid #334155;border-radius:12px;padding:25px;margin-bottom:20px;">
    <h2 style="color:#06b6d4;margin:0 0 18px;font-size:16px;font-weight:700;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #334155;padding-bottom:12px;">
      👤 Investor Profile
    </h2>
    <table width="100%" cellpadding="7" cellspacing="0">
      <tr>
        <td style="color:#94a3b8;font-size:13px;font-weight:600;width:130px;">Name:</td>
        <td style="color:#fff;font-size:15px;font-weight:600;">${name}</td>
      </tr>
      <tr>
        <td style="color:#94a3b8;font-size:13px;font-weight:600;">Email:</td>
        <td><a href="mailto:${email}" style="color:#06b6d4;text-decoration:none;font-size:15px;">${email}</a></td>
      </tr>
      ${phone ? `<tr><td style="color:#94a3b8;font-size:13px;font-weight:600;">Phone:</td><td style="color:#fff;font-size:15px;">${phone}</td></tr>` : ''}
      ${company ? `<tr><td style="color:#94a3b8;font-size:13px;font-weight:600;">Company:</td><td style="color:#fff;font-size:15px;">${company}</td></tr>` : ''}
    </table>
  </div>

  <!-- Investment Details -->
  <div style="background:#0f172a;border:2px solid #334155;border-radius:12px;padding:25px;margin-bottom:20px;">
    <h2 style="color:#10b981;margin:0 0 18px;font-size:16px;font-weight:700;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #334155;padding-bottom:12px;">
      💰 Investment Details
    </h2>
    <table width="100%" cellpadding="7" cellspacing="0">
      <tr>
        <td style="color:#94a3b8;font-size:13px;font-weight:600;width:130px;">Range:</td>
        <td style="color:#10b981;font-size:15px;font-weight:700;">${investmentRange || 'Not specified'}</td>
      </tr>
      <tr>
        <td style="color:#94a3b8;font-size:13px;font-weight:600;">Timeline:</td>
        <td style="color:#fff;font-size:15px;">${timeline || 'Not specified'}</td>
      </tr>
      <tr>
        <td style="color:#94a3b8;font-size:13px;font-weight:600;">Experience:</td>
        <td style="color:#fff;font-size:15px;">${experience || 'Not specified'}</td>
      </tr>
      <tr>
        <td style="color:#94a3b8;font-size:13px;font-weight:600;">Interests:</td>
        <td style="color:#22d3ee;font-size:14px;">${(interests || []).join(', ') || 'Not specified'}</td>
      </tr>
    </table>
  </div>

  <!-- Goals & Questions -->
  ${goals || questions ? `
  <div style="background:#0f172a;border:2px solid #334155;border-radius:12px;padding:25px;margin-bottom:20px;">
    <h2 style="color:#8b5cf6;margin:0 0 18px;font-size:16px;font-weight:700;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #334155;padding-bottom:12px;">
      🎯 Goals & Questions
    </h2>
    ${goals ? `<div style="background:#1e293b;border-left:4px solid #8b5cf6;border-radius:6px;padding:15px;margin-bottom:12px;"><p style="color:#94a3b8;font-size:11px;font-weight:600;text-transform:uppercase;margin:0 0 6px;">Investment Goals:</p><p style="color:#cbd5e1;font-size:14px;line-height:1.7;margin:0;white-space:pre-wrap;">${goals}</p></div>` : ''}
    ${questions ? `<div style="background:#1e293b;border-left:4px solid #06b6d4;border-radius:6px;padding:15px;"><p style="color:#94a3b8;font-size:11px;font-weight:600;text-transform:uppercase;margin:0 0 6px;">Questions:</p><p style="color:#cbd5e1;font-size:14px;line-height:1.7;margin:0;white-space:pre-wrap;">${questions}</p></div>` : ''}
  </div>
  ` : ''}

  <!-- Action -->
  <div style="background:linear-gradient(135deg,#06b6d4 0%,#3b82f6 100%);border-radius:12px;padding:22px;text-align:center;">
    <p style="color:#fff;margin:0 0 6px;font-size:15px;font-weight:700;">⚡ HIGH-PRIORITY INVESTOR LEAD</p>
    <p style="color:rgba(255,255,255,0.9);margin:0;font-size:13px;">Respond within 1 hour for maximum engagement.</p>
  </div>

</td></tr>

<!-- Footer -->
<tr><td style="background:#0f172a;padding:25px;text-align:center;border-top:1px solid #334155;">
  <p style="color:#94a3b8;margin:0 0 6px;font-size:13px;font-weight:600;">OMNIA — Elite Digital Engineering</p>
  <p style="color:#64748b;margin:0;font-size:11px;">
    Received ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'full', timeStyle: 'short' })} (Miami)
  </p>
</td></tr>

</table></td></tr></table>
</body></html>`;

    // ─── Investor auto-reply — Premium HTML ───
    const investorHtml = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 20px;">
<tr><td align="center">
<table width="620" cellpadding="0" cellspacing="0" style="background:#1e293b;border-radius:20px;overflow:hidden;box-shadow:0 30px 100px rgba(0,0,0,0.6);">

<!-- Hero Header -->
<tr><td style="background:linear-gradient(135deg,#06b6d4 0%,#3b82f6 40%,#8b5cf6 100%);padding:55px 40px;text-align:center;">
  <div style="background:rgba(255,255,255,0.12);border:2px solid rgba(255,255,255,0.25);border-radius:100px;width:90px;height:90px;margin:0 auto 20px;line-height:90px;">
    <span style="color:#fff;font-size:44px;font-weight:900;">N</span>
  </div>
  <h1 style="color:#fff;margin:0;font-size:34px;font-weight:800;letter-spacing:-1px;line-height:1.2;">
    Thank You for Your Interest
  </h1>
  <p style="color:rgba(255,255,255,0.92);margin:16px 0 0;font-size:17px;font-weight:400;line-height:1.5;">
    We're excited to explore this opportunity with you
  </p>
</td></tr>

<!-- Body -->
<tr><td style="padding:45px 40px;background:#1e293b;">

  <!-- Greeting -->
  <p style="color:#fff;font-size:20px;font-weight:600;margin:0 0 10px;">
    Hi ${name},
  </p>
  <p style="color:#cbd5e1;font-size:16px;line-height:1.8;margin:0 0 30px;">
    Thank you for expressing interest in the <strong style="color:#06b6d4;">OMNIA</strong> investment program. Your inquiry has been received and our team has been notified.
  </p>

  <!-- Your Inquiry Card -->
  <div style="background:linear-gradient(135deg,#0f172a,#1a2744);border:1px solid #334155;border-radius:16px;padding:28px;margin-bottom:28px;">
    <h3 style="color:#06b6d4;margin:0 0 18px;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:2px;">
      📋 Your Inquiry Summary
    </h3>
    <table width="100%" cellpadding="6" cellspacing="0">
      <tr>
        <td style="color:#64748b;font-size:13px;font-weight:600;width:120px;vertical-align:top;">Investment:</td>
        <td style="color:#10b981;font-size:15px;font-weight:700;">${investmentRange || 'To be discussed'}</td>
      </tr>
      <tr>
        <td style="color:#64748b;font-size:13px;font-weight:600;vertical-align:top;">Timeline:</td>
        <td style="color:#fff;font-size:14px;">${timeline || 'To be discussed'}</td>
      </tr>
      <tr>
        <td style="color:#64748b;font-size:13px;font-weight:600;vertical-align:top;">Focus Areas:</td>
        <td style="color:#22d3ee;font-size:14px;">${(interests || []).join(', ') || 'General'}</td>
      </tr>
    </table>
  </div>

  <!-- What Happens Next -->
  <div style="background:linear-gradient(135deg,#0f172a,#1a2744);border-left:4px solid #06b6d4;border-radius:0 12px 12px 0;padding:25px 28px;margin-bottom:28px;">
    <h3 style="color:#06b6d4;margin:0 0 16px;font-size:15px;font-weight:700;">
      ⏱️ What Happens Next
    </h3>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:8px 0;vertical-align:top;width:30px;">
          <div style="background:#06b6d4;color:#fff;border-radius:50%;width:24px;height:24px;text-align:center;line-height:24px;font-size:12px;font-weight:700;">1</div>
        </td>
        <td style="padding:8px 0 8px 12px;color:#cbd5e1;font-size:14px;line-height:1.6;">
          <strong style="color:#fff;">Review</strong> — Our team reviews your profile and investment criteria
        </td>
      </tr>
      <tr>
        <td style="padding:8px 0;vertical-align:top;">
          <div style="background:#3b82f6;color:#fff;border-radius:50%;width:24px;height:24px;text-align:center;line-height:24px;font-size:12px;font-weight:700;">2</div>
        </td>
        <td style="padding:8px 0 8px 12px;color:#cbd5e1;font-size:14px;line-height:1.6;">
          <strong style="color:#fff;">Preparation</strong> — We prepare a personalized deal memo based on your goals
        </td>
      </tr>
      <tr>
        <td style="padding:8px 0;vertical-align:top;">
          <div style="background:#8b5cf6;color:#fff;border-radius:50%;width:24px;height:24px;text-align:center;line-height:24px;font-size:12px;font-weight:700;">3</div>
        </td>
        <td style="padding:8px 0 8px 12px;color:#cbd5e1;font-size:14px;line-height:1.6;">
          <strong style="color:#fff;">Meeting</strong> — A one-on-one video call to discuss the opportunity in detail
        </td>
      </tr>
    </table>
  </div>

  <!-- CTA Button — Calendly -->
  <div style="text-align:center;margin:35px 0;">
    <p style="color:#94a3b8;font-size:14px;margin:0 0 16px;">Skip the wait — book a meeting directly:</p>
    <a href="${CALENDLY_LINK}" target="_blank" style="display:inline-block;background:linear-gradient(135deg,#06b6d4 0%,#3b82f6 100%);color:#fff;text-decoration:none;padding:18px 48px;border-radius:12px;font-size:17px;font-weight:700;letter-spacing:0.5px;box-shadow:0 8px 30px rgba(6,182,212,0.35);">
      📅 Schedule Your Meeting
    </a>
    <p style="color:#64748b;font-size:12px;margin:12px 0 0;">30-minute confidential video call</p>
  </div>

  <!-- Trust Signals -->
  <div style="background:#0f172a;border-radius:12px;padding:22px 25px;margin-top:25px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="text-align:center;padding:8px;" width="33%">
          <p style="color:#06b6d4;font-size:22px;font-weight:800;margin:0;">$250K+</p>
          <p style="color:#64748b;font-size:11px;margin:4px 0 0;text-transform:uppercase;letter-spacing:1px;">Revenue Target Y3</p>
        </td>
        <td style="text-align:center;padding:8px;border-left:1px solid #334155;border-right:1px solid #334155;" width="34%">
          <p style="color:#10b981;font-size:22px;font-weight:800;margin:0;">40%+</p>
          <p style="color:#64748b;font-size:11px;margin:4px 0 0;text-transform:uppercase;letter-spacing:1px;">Profit Margins</p>
        </td>
        <td style="text-align:center;padding:8px;" width="33%">
          <p style="color:#8b5cf6;font-size:22px;font-weight:800;margin:0;">3-6 mo</p>
          <p style="color:#64748b;font-size:11px;margin:4px 0 0;text-transform:uppercase;letter-spacing:1px;">To Breakeven</p>
        </td>
      </tr>
    </table>
  </div>

  <!-- Confidentiality -->
  <p style="color:#475569;font-size:12px;text-align:center;margin:30px 0 0;line-height:1.6;">
    🔒 Your information is kept strictly confidential and will only be used to evaluate this investment opportunity.
  </p>

</td></tr>

<!-- Footer -->
<tr><td style="background:#0f172a;padding:30px 40px;text-align:center;border-top:1px solid #1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="text-align:center;">
      <div style="background:rgba(6,182,212,0.1);border:1px solid rgba(6,182,212,0.2);border-radius:50%;width:40px;height:40px;margin:0 auto 12px;line-height:40px;">
        <span style="color:#06b6d4;font-size:18px;font-weight:900;">N</span>
      </div>
      <p style="color:#94a3b8;margin:0 0 4px;font-size:14px;font-weight:600;">Neiver Álvarez</p>
      <p style="color:#64748b;margin:0 0 12px;font-size:12px;">Founder & CEO — OMNIA</p>
      <p style="color:#475569;margin:0;font-size:11px;">Miami, FL · neiveralvarez.site</p>
    </td></tr>
  </table>
</td></tr>

</table></td></tr></table>
</body></html>`;

    // Send admin notification
    const adminEmail = await resend.emails.send({
      from: 'OMNIA Investors <investors@neiveralvarez.site>',
      to: ['info@neiveralvarez.site'],
      subject: `💼 Investor Inquiry: ${name} — ${investmentRange || 'New Lead'}`,
      html: adminHtml,
    });
    console.log('✅ Admin notified:', adminEmail);

    // Send investor auto-reply
    const investorEmail = await resend.emails.send({
      from: 'Neiver Álvarez <hello@neiveralvarez.site>',
      to: [email],
      subject: `Thank you for your interest, ${name} — OMNIA Investment Program`,
      html: investorHtml,
    });
    console.log('✅ Investor auto-reply sent:', investorEmail);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: 'Investor inquiry received', id: `inv_${Date.now()}` })
    };

  } catch (error) {
    console.error('❌ Investor form error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Error processing inquiry', details: error.message })
    };
  }
}
