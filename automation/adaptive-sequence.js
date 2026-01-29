// 🔀 ADAPTIVE SEQUENCE - Dynamic email sequence based on behavior
// Decides what to send next based on how the lead reacted

import { analyzeBehavior, generateContextualEmail, logEmailSent } from './conversation-memory.js';
import { generatePersonalizedEmail } from './openai-personalizer.js';
import { enrichLead } from './lead-enricher.js';

/**
 * Email 1 Variants - Different approaches for first contact
 */
const FIRST_EMAIL_VARIANTS = {
  A: {
    name: 'Problem-Focused',
    description: 'Directly mention a specific problem you detected',
    type: 'problem',
    bestFor: 'When you have clear insight into their pain'
  },
  B: {
    name: 'Curiosity',
    description: 'Ask an intriguing question without selling',
    type: 'curiosity',
    bestFor: 'Busy executives who delete sales emails'
  },
  C: {
    name: 'Value-First',
    description: 'Offer something free immediately',
    type: 'value',
    bestFor: 'Smaller companies, more receptive to offers'
  }
};

/**
 * Adaptive Sequence Logic - decides what to send next
 */
export function getNextEmailAction(lead) {
  const behavior = analyzeBehavior(lead);
  
  // Build decision tree
  const decision = {
    lead: lead.email,
    currentStep: lead.sequence_step,
    behavior: behavior,
    action: null,
    emailType: null,
    variant: null,
    reason: null,
    delay: 0
  };

  // STEP 0: First email
  if (lead.sequence_step === 0) {
    decision.action = 'send';
    decision.emailType = 'first_contact';
    decision.variant = lead.enriched_data?.recommended_variant || 
                       selectVariantByProfile(lead);
    decision.reason = `First contact with variant ${decision.variant}`;
    decision.delay = 0;
    return decision;
  }

  // Check if lead replied - stop sequence
  if (behavior.engagement === 'hot') {
    decision.action = 'stop';
    decision.reason = 'Lead replied - manual follow-up required';
    return decision;
  }

  // Check max emails
  if (lead.sequence_step >= 6) {
    decision.action = 'complete';
    decision.reason = 'Sequence complete - max emails reached';
    return decision;
  }

  // ADAPTIVE LOGIC based on behavior
  switch (behavior.pattern) {
    case 'engaged':
      // They clicked - they're interested!
      decision.action = 'send';
      decision.emailType = 'demo'; // Show them something
      decision.reason = 'Engaged (clicked) - sending demo';
      decision.delay = 2; // Faster follow-up
      break;

    case 'opener':
      // Opens everything but doesn't click/reply
      decision.action = 'send';
      decision.emailType = 'question'; // Ask them directly
      decision.reason = 'Opens but no action - asking direct question';
      decision.delay = 3;
      break;

    case 'selective':
      // Some opens, some not
      decision.action = 'send';
      decision.emailType = getSequentialType(lead.sequence_step);
      decision.reason = 'Selective opener - continuing sequence';
      decision.delay = 3;
      break;

    case 'ghost':
      // No opens at all
      if (lead.sequence_step < 3) {
        decision.action = 'send';
        decision.emailType = 'resubject'; // Try different subject
        decision.reason = 'No opens - trying new subject line';
        decision.delay = 4;
      } else {
        decision.action = 'send';
        decision.emailType = 'breakup'; // Time to move on
        decision.reason = 'Ghost lead - sending breakup';
        decision.delay = 7;
      }
      break;

    default:
      decision.action = 'send';
      decision.emailType = getSequentialType(lead.sequence_step);
      decision.reason = 'Default sequence progression';
      decision.delay = 3;
  }

  return decision;
}

/**
 * Select first email variant based on lead profile
 */
function selectVariantByProfile(lead) {
  const title = (lead.job_title || '').toLowerCase();
  const industry = (lead.industry || '').toLowerCase();

  // Executives get curiosity (respect their time)
  if (/ceo|cto|founder|vp|director|head|president/i.test(title)) {
    return 'B';
  }

  // Marketing/Growth people like value offers
  if (/marketing|growth|sales|business dev/i.test(title)) {
    return 'C';
  }

  // Tech people appreciate specific problems
  if (/engineer|developer|tech|product/i.test(title)) {
    return 'A';
  }

  // E-commerce loves free audits
  if (/ecommerce|retail|shop/i.test(industry)) {
    return 'C';
  }

  // Default: random for A/B testing
  const variants = ['A', 'B', 'C'];
  return variants[Math.floor(Math.random() * variants.length)];
}

/**
 * Get sequential email type
 */
function getSequentialType(step) {
  const sequence = [
    'first_contact',  // 0
    'resource',       // 1
    'demo',           // 2
    'case',           // 3
    'question',       // 4
    'breakup'         // 5
  ];
  return sequence[Math.min(step, sequence.length - 1)];
}

/**
 * Generate the next email for a lead based on adaptive logic
 */
export async function generateNextEmail(lead) {
  const decision = getNextEmailAction(lead);
  
  if (decision.action !== 'send') {
    return { decision, email: null };
  }

  // Enrich lead if not already done
  if (!lead.enriched_data) {
    console.log(`🔬 Enriching lead before email generation...`);
    lead.enriched_data = await enrichLead(lead);
  }

  // Generate email based on type
  let email;

  if (decision.emailType === 'first_contact') {
    email = await generateFirstEmail(lead, decision.variant);
  } else if (decision.emailType === 'resubject') {
    email = await generateResubjectEmail(lead);
  } else {
    email = await generateContextualEmail(lead, decision.emailType);
  }

  email.type = decision.emailType;
  email.variant = decision.variant;
  email.angle = decision.reason;

  return { decision, email };
}

/**
 * Generate first email with specific variant
 */
async function generateFirstEmail(lead, variant) {
  const enrichedData = lead.enriched_data || {};
  const problems = enrichedData.detected_problems || [];
  const hooks = enrichedData.personalization_hooks || [];

  let prompt;

  switch (variant) {
    case 'A': // Problem-focused
      prompt = `
Write a cold email (max 80 words) to ${lead.name} at ${lead.company}.
Industry: ${lead.industry}
Role: ${lead.job_title}

THEIR LIKELY PROBLEM: ${problems[0]?.problem || 'website not converting visitors to customers'}

APPROACH: Mention you noticed this specific problem. Don't sell - just offer a free quick analysis.

RULES:
- Start with "Hey ${lead.name.split(' ')[0]},"
- Sound like you genuinely noticed something, not like a template
- End with simple question
- Sign "Neiver"
- NO emojis, NO corporate speak

Generate as JSON: {"subject": "...", "body": "..."}
`;
      break;

    case 'B': // Curiosity
      prompt = `
Write a cold email (max 60 words) to ${lead.name} at ${lead.company}.
Industry: ${lead.industry}
Role: ${lead.job_title}

APPROACH: Ask ONE intriguing question about their priorities. No pitch, no offer, just genuine curiosity.

RULES:
- Start with "Hey ${lead.name.split(' ')[0]},"
- Ultra short - busy executives delete long emails
- End with a simple question that's easy to answer
- Sign "Neiver"

Generate as JSON: {"subject": "...", "body": "..."}
`;
      break;

    case 'C': // Value-first
      prompt = `
Write a cold email (max 80 words) to ${lead.name} at ${lead.company}.
Industry: ${lead.industry}
Role: ${lead.job_title}

APPROACH: Offer something FREE immediately. A website audit, a Loom video review, a specific tip.

RULES:
- Start with "Hey ${lead.name.split(' ')[0]},"
- Lead with the free offer
- Make it sound exclusive (only doing 5 this week, etc.)
- Easy CTA - just reply "interested"
- Sign "Neiver"

Generate as JSON: {"subject": "...", "body": "..."}
`;
      break;
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You write natural cold emails that get replies. Never sound like marketing. Sound like a real person.'
      },
      { role: 'user', content: prompt }
    ],
    temperature: 0.9,
    max_tokens: 200
  });

  return JSON.parse(response.choices[0].message.content.trim());
}

/**
 * Generate email with completely different subject (for ghosts)
 */
async function generateResubjectEmail(lead) {
  const lastEmail = lead.conversation_history?.[lead.conversation_history.length - 1];

  const prompt = `
The last email to ${lead.name} at ${lead.company} was NOT opened.
Previous subject: "${lastEmail?.subject || 'unknown'}"

Write a NEW email with a COMPLETELY DIFFERENT approach.
- Try a different subject line style (question, statement, name only, etc.)
- Different angle than before
- Max 70 words
- Sign "Neiver"

Generate as JSON: {"subject": "...", "body": "..."}
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are testing different approaches to get an email opened. Be creative with subject lines.'
      },
      { role: 'user', content: prompt }
    ],
    temperature: 0.95,
    max_tokens: 200
  });

  return JSON.parse(response.choices[0].message.content.trim());
}

/**
 * Get sequence analytics for a lead
 */
export function getSequenceAnalytics(lead) {
  const history = lead.conversation_history || [];
  const behavior = analyzeBehavior(lead);
  const nextAction = getNextEmailAction(lead);

  return {
    leadEmail: lead.email,
    emailsSent: history.length,
    openRate: history.length > 0 
      ? (history.filter(e => e.opened).length / history.length * 100).toFixed(1) + '%'
      : 'N/A',
    clickRate: history.length > 0
      ? (history.filter(e => e.clicked).length / history.length * 100).toFixed(1) + '%'
      : 'N/A',
    engagement: behavior.engagement,
    pattern: behavior.pattern,
    variantUsed: history[0]?.variant || 'N/A',
    nextAction: nextAction.action,
    nextEmailType: nextAction.emailType,
    reason: nextAction.reason
  };
}

// Need OpenAI for generating emails
import OpenAI from 'openai';
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default {
  getNextEmailAction,
  generateNextEmail,
  getSequenceAnalytics,
  FIRST_EMAIL_VARIANTS
};
