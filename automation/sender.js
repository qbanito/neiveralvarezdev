// 📧 SMART EMAIL SENDER
// Intelligent email sending with rate limiting and safety checks

import { Resend } from 'resend';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { CONFIG, getCurrentDailyLimit, isWithinSendingHours } from './config.js';
import { personalizeLead } from './email-personalizer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resend = new Resend(CONFIG.RESEND_API_KEY);

// Load database files
async function loadData(file) {
  try {
    const data = await fs.readFile(file, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return file.includes('sent.json') ? { sent: [], todaySent: 0, lastReset: new Date().toISOString().split('T')[0] } :
           file.includes('analytics.json') ? { opens: 0, clicks: 0, replies: 0, bounces: 0, unsubscribes: 0 } :
           { leads: [] };
  }
}

async function saveData(file, data) {
  await fs.writeFile(file, JSON.stringify(data, null, 2));
}

// Get template content
async function getTemplate(tier, templateType) {
  let filename;
  
  if (templateType === 'resurrection') {
    filename = 'resurrection.html';
  } else if (templateType === 'initial') {
    filename = `tier${tier}-initial.html`;
  } else {
    filename = `${templateType}.html`;
  }
  
  const templatePath = path.resolve(__dirname, 'templates', filename);
  const template = await fs.readFile(templatePath, 'utf-8');
  return template;
}

// Replace template variables
function renderTemplate(template, data) {
  let rendered = template;
  
  // Replace all {{variable}} placeholders
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'object' && value !== null) {
      // Handle nested objects like relevantProject.name
      for (const [nestedKey, nestedValue] of Object.entries(value)) {
        const placeholder = new RegExp(`{{${key}\\.${nestedKey}}}`, 'g');
        rendered = rendered.replace(placeholder, nestedValue || '');
      }
    } else {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      rendered = rendered.replace(placeholder, value || '');
    }
  }
  
  // Add unsubscribe URL (unique per lead)
  const unsubscribeUrl = `https://neiveralvarez.dev/unsubscribe?email=${encodeURIComponent(data.email || '')}`;
  rendered = rendered.replace(/{{unsubscribeUrl}}/g, unsubscribeUrl);
  
  return rendered;
}

// Check if we can send today
async function checkDailyLimit() {
  const sentData = await loadData(CONFIG.DATA_FILES.SENT);
  const today = new Date().toISOString().split('T')[0];
  
  // Reset counter if new day
  if (sentData.lastReset !== today) {
    sentData.todaySent = 0;
    sentData.lastReset = today;
    await saveData(CONFIG.DATA_FILES.SENT, sentData);
  }
  
  const dailyLimit = getCurrentDailyLimit();
  const remaining = dailyLimit - sentData.todaySent;
  
  return {
    canSend: remaining > 0,
    remaining,
    dailyLimit,
    todaySent: sentData.todaySent
  };
}

// Check safety metrics
async function checkSafetyMetrics() {
  const analytics = await loadData(CONFIG.DATA_FILES.ANALYTICS);
  const sentData = await loadData(CONFIG.DATA_FILES.SENT);
  
  const totalSent = sentData.sent.length;
  if (totalSent === 0) return { safe: true, reason: 'No sends yet' };
  
  const bounceRate = analytics.bounces / totalSent;
  const spamRate = analytics.spam_reports / totalSent;
  
  if (bounceRate > CONFIG.SAFETY.BOUNCE_RATE_THRESHOLD) {
    return {
      safe: false,
      reason: `Bounce rate too high: ${(bounceRate * 100).toFixed(2)}%`
    };
  }
  
  if (spamRate > CONFIG.SAFETY.SPAM_RATE_THRESHOLD) {
    return {
      safe: false,
      reason: `Spam rate too high: ${(spamRate * 100).toFixed(2)}%`
    };
  }
  
  return { safe: true };
}

// Get leads ready to send
async function getLeadsToSend(limit) {
  const leadsData = await loadData(CONFIG.DATA_FILES.LEADS);
  const today = new Date().toISOString().split('T')[0];
  
  const readyLeads = leadsData.leads.filter(lead => {
    return lead.status === 'pending' &&
           lead.next_contact <= today;
  });
  
  // Sort by tier (tier 1 first) and then by date added
  readyLeads.sort((a, b) => {
    if (a.tier !== b.tier) return a.tier - b.tier;
    return new Date(a.added_date) - new Date(b.added_date);
  });
  
  return readyLeads.slice(0, limit);
}

// Send single email
async function sendEmail(lead, templateType = 'initial') {
  try {
    // Personalize lead data
    const personalizedData = personalizeLead(lead, templateType);
    
    // Get and render template
    const template = await getTemplate(lead.tier, templateType);
    const htmlContent = renderTemplate(template, { ...personalizedData, email: lead.email });
    
    // Send via Resend
    const result = await resend.emails.send({
      from: `${CONFIG.FROM_NAME} <${CONFIG.FROM_EMAIL}>`,
      to: lead.email,
      subject: personalizedData.subject,
      html: htmlContent,
      replyTo: CONFIG.REPLY_TO,
      headers: {
        'X-Lead-ID': lead.id,
        'X-Campaign-Type': templateType,
        'X-Lead-Tier': `${lead.tier}`
      }
    });
    
    return {
      success: true,
      emailId: result.id,
      lead: lead,
      personalizedData
    };
    
  } catch (error) {
    console.error(`❌ Failed to send to ${lead.email}:`, error.message);
    return {
      success: false,
      error: error.message,
      lead: lead
    };
  }
}

// Log sent email
async function logSentEmail(lead, result, templateType) {
  const sentData = await loadData(CONFIG.DATA_FILES.SENT);
  const leadsData = await loadData(CONFIG.DATA_FILES.LEADS);
  
  // Add to sent log
  sentData.sent.push({
    leadId: lead.id,
    email: lead.email,
    emailId: result.emailId,
    sentAt: new Date().toISOString(),
    templateType,
    tier: lead.tier,
    subject: result.personalizedData.subject
  });
  
  sentData.todaySent += 1;
  
  // Update lead status
  const leadIndex = leadsData.leads.findIndex(l => l.id === lead.id);
  if (leadIndex !== -1) {
    leadsData.leads[leadIndex].status = 'sent';
    leadsData.leads[leadIndex].last_contact = new Date().toISOString().split('T')[0];
    leadsData.leads[leadIndex].sequence_step += 1;
    
    // Calculate next follow-up date
    const nextDelay = getNextDelay(leadsData.leads[leadIndex].sequence_step);
    if (nextDelay) {
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + nextDelay);
      leadsData.leads[leadIndex].next_contact = nextDate.toISOString().split('T')[0];
      leadsData.leads[leadIndex].status = 'pending'; // Ready for follow-up
    }
  }
  
  await saveData(CONFIG.DATA_FILES.SENT, sentData);
  await saveData(CONFIG.DATA_FILES.LEADS, leadsData);
}

// Get next delay based on sequence step
function getNextDelay(step) {
  const delays = {
    1: 3,  // Follow-up 1 after 3 days
    2: 7,  // Follow-up 2 after 7 days
    3: 14  // Breakup after 14 days
  };
  return delays[step] || null;
}

// Get template type based on sequence step
function getTemplateType(step, isResurrection) {
  if (isResurrection) return 'resurrection';
  
  const templates = {
    0: 'initial',
    1: 'follow-up-1',
    2: 'follow-up-2',
    3: 'breakup'
  };
  return templates[step] || 'initial';
}

// Main send function
export async function sendCampaigns() {
  console.log('🚀 Starting smart email sender...\n');
  
  // Check if within sending hours (skip if FORCE_SEND is set)
  const forceSend = process.env.FORCE_SEND === 'true';
  if (!forceSend && !isWithinSendingHours()) {
    console.log('⏰ Outside sending hours (Mon-Fri, 9am-5pm). Skipping.');
    console.log('💡 Tip: Set FORCE_SEND=true to override');
    return;
  }
  
  if (forceSend) {
    console.log('⚡ FORCE_SEND enabled - bypassing time restrictions');
  }
  
  // Check daily limit
  const limitStatus = await checkDailyLimit();
  console.log(`📊 Daily Status: ${limitStatus.todaySent}/${limitStatus.dailyLimit} sent today`);
  
  if (!limitStatus.canSend) {
    console.log('✅ Daily limit reached. Stopping.');
    return;
  }
  
  // Check safety metrics
  const safety = await checkSafetyMetrics();
  if (!safety.safe) {
    console.error(`⚠️  SAFETY CHECK FAILED: ${safety.reason}`);
    console.error('🛑 Stopping all sends. Manual review required.');
    return;
  }
  
  // Get leads to send
  const leads = await getLeadsToSend(limitStatus.remaining);
  console.log(`📬 Found ${leads.length} leads ready to contact\n`);
  
  if (leads.length === 0) {
    console.log('✅ No leads ready to send. Check back later.');
    return;
  }
  
  // Send emails
  let successCount = 0;
  let failCount = 0;
  
  for (const lead of leads) {
    const templateType = getTemplateType(
      lead.sequence_step,
      lead.resurrection_count > 0 && lead.sequence_step === 0
    );
    
    console.log(`📧 Sending to: ${lead.email} (Tier ${lead.tier}, ${templateType})`);
    
    const result = await sendEmail(lead, templateType);
    
    if (result.success) {
      await logSentEmail(lead, result, templateType);
      successCount++;
      console.log(`   ✅ Sent! Subject: "${result.personalizedData.subject}"`);
    } else {
      failCount++;
      console.log(`   ❌ Failed: ${result.error}`);
    }
    
    // Small delay between sends (respect rate limits)
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Summary
  console.log(`\n📊 SEND SUMMARY:`);
  console.log(`   Success: ${successCount}`);
  console.log(`   Failed: ${failCount}`);
  console.log(`   Remaining today: ${limitStatus.remaining - successCount}`);
  console.log(`\n✅ Campaign send complete!`);
}

// Run if called directly
sendCampaigns().catch(console.error);

export default { sendCampaigns };
