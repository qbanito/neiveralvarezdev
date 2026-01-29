// 🧠 CONVERSATION MEMORY - Maintains context across email sequence
// Stores what we sent, how they reacted, and generates coherent follow-ups

import OpenAI from 'openai';
import fs from 'fs/promises';
import { CONFIG } from './config.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Add an email to lead's conversation history
 */
export async function logEmailSent(lead, emailData) {
  const historyEntry = {
    id: `email_${Date.now()}`,
    sent_at: new Date().toISOString(),
    email_type: emailData.type,
    variant: emailData.variant || null,
    subject: emailData.subject,
    body: emailData.body,
    angle: emailData.angle || null,
    // Tracking (will be updated by webhooks)
    opened: false,
    opened_at: null,
    clicked: false,
    clicked_at: null,
    replied: false,
    replied_at: null
  };

  // Initialize conversation history if needed
  if (!lead.conversation_history) {
    lead.conversation_history = [];
  }

  lead.conversation_history.push(historyEntry);
  
  return historyEntry;
}

/**
 * Update email tracking status
 */
export async function updateEmailStatus(lead, emailId, status) {
  if (!lead.conversation_history) return;
  
  const email = lead.conversation_history.find(e => e.id === emailId);
  if (email) {
    if (status.opened) {
      email.opened = true;
      email.opened_at = new Date().toISOString();
    }
    if (status.clicked) {
      email.clicked = true;
      email.clicked_at = new Date().toISOString();
    }
    if (status.replied) {
      email.replied = true;
      email.replied_at = new Date().toISOString();
    }
  }
}

/**
 * Get lead's behavior pattern for adaptive sequence
 */
export function analyzeBehavior(lead) {
  const history = lead.conversation_history || [];
  
  if (history.length === 0) {
    return {
      pattern: 'new',
      engagement: 'unknown',
      nextAction: 'send_first_email'
    };
  }

  const lastEmail = history[history.length - 1];
  const totalOpens = history.filter(e => e.opened).length;
  const totalClicks = history.filter(e => e.clicked).length;
  const hasReplied = history.some(e => e.replied);

  // Determine engagement level
  let engagement;
  if (hasReplied) {
    engagement = 'hot';
  } else if (totalClicks > 0) {
    engagement = 'warm';
  } else if (totalOpens > 0) {
    engagement = 'lukewarm';
  } else {
    engagement = 'cold';
  }

  // Determine next email type based on pattern
  let nextEmailType;
  let reason;

  if (hasReplied) {
    nextEmailType = 'stop'; // Don't send more automated emails
    reason = 'Lead replied, manual follow-up needed';
  } else if (lastEmail.opened && lastEmail.clicked) {
    nextEmailType = 'demo'; // They're interested, show them something
    reason = 'Opened and clicked, showing strong interest';
  } else if (lastEmail.opened && !lastEmail.clicked) {
    nextEmailType = 'problem'; // Read but didn't engage, try different angle
    reason = 'Opened but no click, try deeper problem angle';
  } else if (!lastEmail.opened && history.length === 1) {
    nextEmailType = 'resubject'; // Didn't open first email, try new subject
    reason = 'First email not opened, try different subject line';
  } else if (!lastEmail.opened && history.length > 1) {
    nextEmailType = 'breakup'; // Multiple unopened, time to break up
    reason = 'Multiple emails unopened, send breakup';
  } else {
    nextEmailType = getSequentialNextType(history.length);
    reason = 'Following standard sequence';
  }

  return {
    pattern: determinePattern(history),
    engagement,
    totalEmails: history.length,
    totalOpens,
    totalClicks,
    lastEmailOpened: lastEmail.opened,
    lastEmailClicked: lastEmail.clicked,
    nextEmailType,
    reason
  };
}

/**
 * Determine behavioral pattern
 */
function determinePattern(history) {
  if (history.length === 0) return 'new';
  
  const opens = history.filter(e => e.opened).length;
  const clicks = history.filter(e => e.clicked).length;
  
  if (clicks > 0) return 'engaged';
  if (opens === history.length) return 'opener';
  if (opens > 0) return 'selective';
  return 'ghost';
}

/**
 * Get next email type in standard sequence
 */
function getSequentialNextType(emailCount) {
  const sequence = ['detective', 'resource', 'demo', 'case', 'question', 'friend'];
  return sequence[Math.min(emailCount, sequence.length - 1)];
}

/**
 * Generate contextual follow-up using conversation history
 */
export async function generateContextualEmail(lead, emailType) {
  const history = lead.conversation_history || [];
  const enrichedData = lead.enriched_data || {};
  
  // Build conversation context for AI
  const conversationContext = history.map(email => ({
    date: email.sent_at,
    type: email.email_type,
    subject: email.subject,
    body: email.body.substring(0, 200) + '...', // Truncate for tokens
    opened: email.opened,
    clicked: email.clicked
  }));

  const prompt = `
You are writing a follow-up email for an ongoing outreach sequence.

LEAD INFO:
- Name: ${lead.name}
- Company: ${lead.company}
- Job Title: ${lead.job_title}
- Industry: ${lead.industry}

ENRICHED INSIGHTS:
${enrichedData.detected_problems ? `- Problems: ${enrichedData.detected_problems.map(p => p.problem).join(', ')}` : ''}
${enrichedData.recommended_service ? `- Recommended service: ${enrichedData.recommended_service}` : ''}
${enrichedData.personalization_hooks ? `- Hooks: ${enrichedData.personalization_hooks.join(', ')}` : ''}

PREVIOUS EMAILS SENT:
${conversationContext.length > 0 ? 
  conversationContext.map((e, i) => 
    `Email ${i + 1} (${e.type}): "${e.subject}" - ${e.opened ? 'OPENED' : 'not opened'}${e.clicked ? ', CLICKED' : ''}`
  ).join('\n') 
  : 'No previous emails'}

EMAIL TYPE TO GENERATE: ${emailType}
${emailType === 'resubject' ? 'IMPORTANT: They did NOT open the last email. Write something completely different that will get their attention.' : ''}
${emailType === 'problem' ? 'IMPORTANT: They opened but didnt engage. Go deeper on a specific pain point.' : ''}
${emailType === 'demo' ? 'IMPORTANT: They showed interest. Include demo link: https://neiveralvarez.site/demo' : ''}

RULES:
- Reference something from the previous emails naturally if appropriate
- DON'T repeat the same angle
- Maximum 80 words
- Sound like a real person, not a sequence
- Sign only "Neiver"

Generate the email subject and body in JSON format:
{
  "subject": "email subject",
  "body": "email body"
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You write natural, contextual follow-up emails that reference previous conversations appropriately. Never sound robotic or templated.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.9,
      max_tokens: 250
    });

    return JSON.parse(response.choices[0].message.content.trim());
  } catch (error) {
    console.error('Error generating contextual email:', error);
    throw error;
  }
}

/**
 * Get full conversation summary for a lead
 */
export function getConversationSummary(lead) {
  const history = lead.conversation_history || [];
  const behavior = analyzeBehavior(lead);
  
  return {
    leadEmail: lead.email,
    leadName: lead.name,
    totalEmailsSent: history.length,
    behavior: behavior,
    timeline: history.map(e => ({
      date: e.sent_at,
      type: e.email_type,
      subject: e.subject,
      opened: e.opened,
      clicked: e.clicked,
      replied: e.replied
    }))
  };
}

export default {
  logEmailSent,
  updateEmailStatus,
  analyzeBehavior,
  generateContextualEmail,
  getConversationSummary
};
