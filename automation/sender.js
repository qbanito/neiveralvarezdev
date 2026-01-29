// 📧 SMART EMAIL SENDER v2.0
// Intelligent email sending with adaptive sequences, AI personalization, and conversation memory

import { Resend } from 'resend';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { CONFIG, getCurrentDailyLimit, isWithinSendingHours } from './config.js';
import { personalizeLead } from './email-personalizer.js';
import { generatePersonalizedEmail } from './openai-personalizer.js';
import { researchLead, enrichLeadWithResearch } from './lead-researcher.js';
import { enrichLead } from './lead-enricher.js';
import { logEmailSent, analyzeBehavior, getConversationSummary } from './conversation-memory.js';
import { getNextEmailAction, generateNextEmail, getSequenceAnalytics } from './adaptive-sequence.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resend = new Resend(CONFIG.RESEND_API_KEY);

// ¿Usar AI para personalización?
const USE_AI_PERSONALIZATION = CONFIG.OPENAI?.ENABLE_AI_PERSONALIZATION ?? true;

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
  
  console.log(`📅 Today's date: ${today}`);
  console.log(`📊 Total leads in database: ${leadsData.leads?.length || 0}`);
  
  if (!leadsData.leads || leadsData.leads.length === 0) {
    console.log('⚠️ No leads found in database');
    return [];
  }
  
  // Debug first few leads
  console.log('🔍 Sample lead statuses:');
  leadsData.leads.slice(0, 5).forEach(l => {
    console.log(`   - ${l.email}: status=${l.status}, next_contact=${l.next_contact}, eligible=${l.status === 'pending' && l.next_contact <= today}`);
  });
  
  const readyLeads = leadsData.leads.filter(lead => {
    return lead.status === 'pending' &&
           lead.next_contact <= today;
  });
  
  console.log(`✅ Found ${readyLeads.length} leads with status=pending and next_contact <= ${today}`);
  
  // Sort by tier (tier 1 first) and then by date added
  readyLeads.sort((a, b) => {
    if (a.tier !== b.tier) return a.tier - b.tier;
    return new Date(a.added_date) - new Date(b.added_date);
  });
  
  return readyLeads.slice(0, limit);
}

// Send single email (with deep enrichment + adaptive logic)
async function sendEmail(lead, templateType = 'initial') {
  try {
    let subject, htmlContent, variant = null, body = '';
    
    // Usar AI personalization si está habilitado
    if (USE_AI_PERSONALIZATION && process.env.OPENAI_API_KEY) {
      console.log(`   🤖 Generando email con AI para ${lead.email}...`);
      
      // 🔬 Enriquecer lead con análisis profundo (empresa, problemas, hooks)
      let enrichedData = lead.enriched_data;
      if (!enrichedData) {
        console.log(`   🔬 Analizando empresa en profundidad...`);
        try {
          enrichedData = await enrichLead(lead);
          lead.enriched_data = enrichedData;
          console.log(`   📊 Problemas detectados: ${enrichedData.detected_problems?.length || 0}`);
        } catch (enrichError) {
          console.log(`   ⚠️ Enrichment failed, using basic data: ${enrichError.message}`);
          enrichedData = {};
        }
      }
      
      // 🧠 Obtener contexto de conversación previa
      const conversationSummary = await getConversationSummary(lead.email);
      if (conversationSummary.emailCount > 0) {
        console.log(`   💬 Historial: ${conversationSummary.emailCount} emails, engagement: ${conversationSummary.engagement}`);
      }
      
      // 🎯 Obtener siguiente acción adaptativa
      const nextAction = getNextEmailAction({ ...lead, enriched_data: enrichedData });
      if (nextAction.action !== 'send') {
        console.log(`   ⏸️ Action: ${nextAction.action} - ${nextAction.reason}`);
        return { success: false, error: nextAction.reason };
      }
      
      variant = nextAction.variant || enrichedData.recommended_variant;
      const adaptiveType = nextAction.emailType || templateType;
      console.log(`   📋 Type: ${adaptiveType}, Variant: ${variant || 'default'}`);
      
      // Investigar el lead
      const research = await researchLead(lead);
      const enrichedLead = enrichLeadWithResearch(lead, research);
      enrichedLead.enriched_data = enrichedData;
      enrichedLead.conversation_history = conversationSummary.lastEmails || [];
      
      // Mapear template types viejos a nuevos
      const typeMapping = {
        'initial': 'detective',
        'follow-up-1': 'resource',
        'follow-up-2': 'demo',
        'follow-up-3': 'case',
        'follow-up-4': 'question',
        'breakup': 'friend',
        'resurrection': 'detective'
      };
      
      const aiEmailType = typeMapping[adaptiveType] || adaptiveType;
      
      // Generar email único con OpenAI
      const aiEmail = await generatePersonalizedEmail(enrichedLead, aiEmailType, research);
      
      subject = aiEmail.subject;
      body = aiEmail.body;
      // Convertir texto plano a HTML simple
      htmlContent = convertToSimpleHtml(aiEmail.body);
      
    } else {
      // Fallback a personalización tradicional
      console.log(`   📝 Usando personalización tradicional para ${lead.email}...`);
      const personalizedData = personalizeLead(lead, templateType);
      const template = await getTemplate(lead.tier, templateType);
      htmlContent = renderTemplate(template, { ...personalizedData, email: lead.email });
      subject = personalizedData.subject;
    }

    // Send via Resend
    const result = await resend.emails.send({
      from: `${CONFIG.FROM_NAME} <${CONFIG.FROM_EMAIL}>`,
      to: lead.email,
      bcc: CONFIG.FORWARD_TO, // Copy for review
      subject: subject,
      html: htmlContent,
      replyTo: CONFIG.REPLY_TO,
      headers: {
        'X-Lead-ID': lead.id,
        'X-Campaign-Type': templateType,
        'X-Lead-Tier': `${lead.tier}`,
        'X-AI-Generated': USE_AI_PERSONALIZATION ? 'true' : 'false'
      }
    });
    
    return {
      success: true,
      emailId: result.id,
      lead: lead,
      personalizedData: { subject },
      variant: variant,
      body: body
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

// Convertir texto plano a HTML simple (estilo email personal)
function convertToSimpleHtml(text) {
  const paragraphs = text.split('\n\n').map(p => p.trim()).filter(p => p);
  const htmlParagraphs = paragraphs.map(p => {
    // Convertir saltos de línea simples a <br>
    const withBreaks = p.replace(/\n/g, '<br>');
    // Convertir links
    const withLinks = withBreaks.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" style="color: #0066cc;">$1</a>'
    );
    return `<p style="margin: 0 0 16px 0;">${withLinks}</p>`;
  });
  
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; line-height: 1.6; color: #1a1a1a; max-width: 600px; padding: 20px;">
${htmlParagraphs.join('\n')}
</body>
</html>
  `.trim();
}

// Log sent email (+ save to conversation memory)
async function logSentEmail(lead, result, templateType) {
  const sentData = await loadData(CONFIG.DATA_FILES.SENT);
  const leadsData = await loadData(CONFIG.DATA_FILES.LEADS);
  
  // Add to sent log
  const sentRecord = {
    leadId: lead.id,
    email: lead.email,
    emailId: result.emailId,
    sentAt: new Date().toISOString(),
    templateType,
    tier: lead.tier,
    subject: result.personalizedData.subject,
    variant: result.variant || null,
    aiGenerated: USE_AI_PERSONALIZATION
  };
  
  sentData.sent.push(sentRecord);
  sentData.todaySent += 1;
  
  // 🧠 Save to conversation memory for coherence tracking
  try {
    await logEmailSent(lead.email, {
      subject: result.personalizedData.subject,
      body: result.body || '',
      emailType: templateType,
      variant: result.variant
    }, result.emailId);
    console.log(`   🧠 Saved to conversation memory`);
  } catch (memoryError) {
    console.log(`   ⚠️ Memory save failed: ${memoryError.message}`);
  }
  
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

// Get next delay based on sequence step (Nueva secuencia de 6 emails)
function getNextDelay(step) {
  const delays = {
    1: 3,   // Resource después de 3 días
    2: 7,   // Demo después de 7 días
    3: 11,  // Case después de 11 días
    4: 15,  // Question después de 15 días
    5: 21   // Friend (despedida) después de 21 días
  };
  return delays[step] || null;
}

// Get template type based on sequence step (Nueva secuencia)
function getTemplateType(step, isResurrection) {
  if (isResurrection) return 'detective'; // Resurrección = nuevo inicio
  
  const templates = {
    0: 'detective',     // Email 1: El Detective
    1: 'resource',      // Email 2: El Recurso
    2: 'demo',          // Email 3: El Demo
    3: 'case',          // Email 4: El Caso
    4: 'question',      // Email 5: La Pregunta
    5: 'friend'         // Email 6: El Amigo (despedida)
  };
  return templates[step] || 'detective';
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
