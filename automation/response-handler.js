// 📥 RESPONSE HANDLER
// Handles email replies and forwards to convoycubano@gmail.com

import { Resend } from 'resend';
import fs from 'fs/promises';
import { CONFIG } from './config.js';

const resend = new Resend(CONFIG.RESEND_API_KEY);

// Load data
async function loadData(file) {
  try {
    const data = await fs.readFile(file, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return file.includes('leads.json') ? { leads: [] } : 
           file.includes('analytics.json') ? { replies: 0, opens: 0, clicks: 0 } : {};
  }
}

async function saveData(file, data) {
  await fs.writeFile(file, JSON.stringify(data, null, 2));
}

// Handle incoming webhook from Resend
export async function handleWebhook(event) {
  const { type, data } = event;
  
  console.log(`📨 Webhook received: ${type}`);
  
  switch (type) {
    case 'email.opened':
      await handleEmailOpened(data);
      break;
      
    case 'email.clicked':
      await handleEmailClicked(data);
      break;
      
    case 'email.replied':
      await handleEmailReplied(data);
      break;
      
    case 'email.bounced':
      await handleEmailBounced(data);
      break;
      
    case 'email.complained':
      await handleEmailComplained(data);
      break;
      
    default:
      console.log(`⚠️  Unknown webhook type: ${type}`);
  }
}

// Handle email opened
async function handleEmailOpened(data) {
  const { email, emailId } = data;
  
  // Update lead status
  const leadsData = await loadData(CONFIG.DATA_FILES.LEADS);
  const lead = leadsData.leads.find(l => l.email === email);
  
  if (lead && lead.status === 'sent') {
    lead.status = 'opened';
    lead.opened_at = new Date().toISOString();
    await saveData(CONFIG.DATA_FILES.LEADS, leadsData);
  }
  
  // Update analytics
  const analytics = await loadData(CONFIG.DATA_FILES.ANALYTICS);
  analytics.opens = (analytics.opens || 0) + 1;
  await saveData(CONFIG.DATA_FILES.ANALYTICS, analytics);
  
  console.log(`👀 Email opened: ${email}`);
}

// Handle email clicked
async function handleEmailClicked(data) {
  const { email, link } = data;
  
  // Update lead status
  const leadsData = await loadData(CONFIG.DATA_FILES.LEADS);
  const lead = leadsData.leads.find(l => l.email === email);
  
  if (lead) {
    lead.status = 'clicked';
    lead.clicked_at = new Date().toISOString();
    lead.clicked_link = link;
    await saveData(CONFIG.DATA_FILES.LEADS, leadsData);
  }
  
  // Update analytics
  const analytics = await loadData(CONFIG.DATA_FILES.ANALYTICS);
  analytics.clicks = (analytics.clicks || 0) + 1;
  await saveData(CONFIG.DATA_FILES.ANALYTICS, analytics);
  
  console.log(`🖱️  Link clicked: ${email} -> ${link}`);
}

// Handle email replied (MOST IMPORTANT)
async function handleEmailReplied(data) {
  const { email, from, subject, text, html } = data;
  
  console.log(`\n🎉 GOT A REPLY from ${email}!`);
  
  // Update lead status
  const leadsData = await loadData(CONFIG.DATA_FILES.LEADS);
  const lead = leadsData.leads.find(l => l.email === email);
  
  if (lead) {
    lead.status = 'replied';
    lead.replied_at = new Date().toISOString();
    lead.reply_count = (lead.reply_count || 0) + 1;
    
    // Stop sequence - don't send more follow-ups
    lead.next_contact = null;
    
    await saveData(CONFIG.DATA_FILES.LEADS, leadsData);
  }
  
  // Update analytics
  const analytics = await loadData(CONFIG.DATA_FILES.ANALYTICS);
  analytics.replies = (analytics.replies || 0) + 1;
  await saveData(CONFIG.DATA_FILES.ANALYTICS, analytics);
  
  // Forward to convoycubano@gmail.com
  await forwardReply(email, subject, text || html, lead);
}

// Forward reply to your email
async function forwardReply(fromEmail, subject, content, lead) {
  try {
    const forwardHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
    .content { padding: 30px; background: #ffffff; }
    .lead-info { background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
    .reply-content { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin: 0; font-size: 24px;">🎉 New Lead Reply!</h1>
    <p style="margin: 10px 0 0 0; opacity: 0.9;">You got a response from your outreach campaign</p>
  </div>
  
  <div class="content">
    <h2 style="color: #1f2937; margin-top: 0;">Lead Information</h2>
    
    <div class="lead-info">
      <p style="margin: 5px 0;"><strong>Name:</strong> ${lead?.name || 'Unknown'}</p>
      <p style="margin: 5px 0;"><strong>Email:</strong> ${fromEmail}</p>
      <p style="margin: 5px 0;"><strong>Company:</strong> ${lead?.company || 'Unknown'}</p>
      <p style="margin: 5px 0;"><strong>Title:</strong> ${lead?.job_title || 'Unknown'}</p>
      <p style="margin: 5px 0;"><strong>Industry:</strong> ${lead?.industry || 'Unknown'}</p>
      <p style="margin: 5px 0;"><strong>Tier:</strong> ${lead?.tier || '?'}</p>
      <p style="margin: 5px 0;"><strong>LinkedIn:</strong> ${lead?.linkedin_url ? `<a href="${lead.linkedin_url}">${lead.linkedin_url}</a>` : 'N/A'}</p>
    </div>
    
    <h3 style="color: #374151;">Reply Subject</h3>
    <p style="background: #f3f4f6; padding: 10px; border-radius: 6px;"><strong>${subject}</strong></p>
    
    <h3 style="color: #374151;">Reply Content</h3>
    <div class="reply-content">
      ${content}
    </div>
    
    <a href="mailto:${fromEmail}?subject=Re: ${encodeURIComponent(subject)}" class="cta-button">
      Reply to ${lead?.name || fromEmail}
    </a>
    
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
    
    <p style="color: #6b7280; font-size: 13px; margin: 0;">
      This email was automatically forwarded from your outreach automation system.
    </p>
  </div>
</body>
</html>
    `;
    
    await resend.emails.send({
      from: `Lead Notifications <${CONFIG.FROM_EMAIL}>`,
      to: CONFIG.FORWARD_TO,
      subject: `🎉 New Reply: ${lead?.name || fromEmail} - ${subject}`,
      html: forwardHtml,
      replyTo: fromEmail
    });
    
    console.log(`✅ Reply forwarded to ${CONFIG.FORWARD_TO}`);
    
  } catch (error) {
    console.error('❌ Failed to forward reply:', error.message);
  }
}

// Handle bounced email
async function handleEmailBounced(data) {
  const { email, bounceType } = data;
  
  console.log(`⚠️  Email bounced: ${email} (${bounceType})`);
  
  // Update lead status
  const leadsData = await loadData(CONFIG.DATA_FILES.LEADS);
  const lead = leadsData.leads.find(l => l.email === email);
  
  if (lead) {
    lead.status = 'bounced';
    lead.bounced_at = new Date().toISOString();
    lead.bounce_type = bounceType;
    lead.next_contact = null; // Stop sequence
    await saveData(CONFIG.DATA_FILES.LEADS, leadsData);
  }
  
  // Update analytics
  const analytics = await loadData(CONFIG.DATA_FILES.ANALYTICS);
  analytics.bounces = (analytics.bounces || 0) + 1;
  await saveData(CONFIG.DATA_FILES.ANALYTICS, analytics);
}

// Handle spam complaint
async function handleEmailComplained(data) {
  const { email } = data;
  
  console.log(`🚨 SPAM COMPLAINT: ${email}`);
  
  // Update lead status
  const leadsData = await loadData(CONFIG.DATA_FILES.LEADS);
  const lead = leadsData.leads.find(l => l.email === email);
  
  if (lead) {
    lead.status = 'complained';
    lead.complained_at = new Date().toISOString();
    lead.next_contact = null;
    await saveData(CONFIG.DATA_FILES.LEADS, leadsData);
  }
  
  // Add to unsubscribed list
  const unsubscribed = await loadData(CONFIG.DATA_FILES.UNSUBSCRIBED);
  if (!unsubscribed.emails) unsubscribed.emails = [];
  if (!unsubscribed.emails.includes(email)) {
    unsubscribed.emails.push(email);
    await saveData(CONFIG.DATA_FILES.UNSUBSCRIBED, unsubscribed);
  }
  
  // Update analytics
  const analytics = await loadData(CONFIG.DATA_FILES.ANALYTICS);
  analytics.spam_reports = (analytics.spam_reports || 0) + 1;
  await saveData(CONFIG.DATA_FILES.ANALYTICS, analytics);
}

// Handle unsubscribe request
export async function handleUnsubscribe(email) {
  console.log(`👋 Unsubscribe request: ${email}`);
  
  // Update lead status
  const leadsData = await loadData(CONFIG.DATA_FILES.LEADS);
  const lead = leadsData.leads.find(l => l.email === email);
  
  if (lead) {
    lead.status = 'unsubscribed';
    lead.unsubscribed_at = new Date().toISOString();
    lead.next_contact = null;
    await saveData(CONFIG.DATA_FILES.LEADS, leadsData);
  }
  
  // Add to unsubscribed list
  const unsubscribed = await loadData(CONFIG.DATA_FILES.UNSUBSCRIBED);
  if (!unsubscribed.emails) unsubscribed.emails = [];
  if (!unsubscribed.emails.includes(email)) {
    unsubscribed.emails.push(email);
    await saveData(CONFIG.DATA_FILES.UNSUBSCRIBED, unsubscribed);
  }
  
  // Update analytics
  const analytics = await loadData(CONFIG.DATA_FILES.ANALYTICS);
  analytics.unsubscribes = (analytics.unsubscribes || 0) + 1;
  await saveData(CONFIG.DATA_FILES.ANALYTICS, analytics);
  
  return { success: true, message: 'Successfully unsubscribed' };
}

export default { handleWebhook, handleUnsubscribe };
