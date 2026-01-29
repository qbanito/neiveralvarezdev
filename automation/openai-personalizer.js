// 🤖 OPENAI PERSONALIZER - Emails that look handwritten
// Uses GPT-4 to generate unique, human emails for each lead

import OpenAI from 'openai';
import { CONFIG } from './config.js';

// Clean API key (remove whitespace, newlines that cause HTTP header errors)
const apiKey = (process.env.OPENAI_API_KEY || '').trim().replace(/[\r\n]/g, '');

if (!apiKey) {
  console.error('⚠️ OPENAI_API_KEY not set or empty');
}

const openai = new OpenAI({
  apiKey: apiKey
});

// Signature for all emails
const SIGNATURE = `
📞 +1 (786) 987-6934
💬 WhatsApp: +1 (786) 543-2478
✉️ info@neiveralvarez.site
`;

// Demo configuration - single demo page
const DEMOS = {
  'E-commerce': {
    url: 'https://neiveralvarez.site/demo',
    description: 'optimized checkout that reduces cart abandonment by 40%'
  },
  'Retail': {
    url: 'https://neiveralvarez.site/demo',
    description: 'conversion-optimized online store'
  },
  'SaaS': {
    url: 'https://neiveralvarez.site/demo',
    description: 'real-time analytics dashboard'
  },
  'Technology': {
    url: 'https://neiveralvarez.site/demo',
    description: 'platform with integrated AI'
  },
  'Real Estate': {
    url: 'https://neiveralvarez.site/demo',
    description: 'property portal with smart search'
  },
  'PropTech': {
    url: 'https://neiveralvarez.site/demo',
    description: 'real estate management system'
  },
  'Services': {
    url: 'https://neiveralvarez.site/demo',
    description: 'automated booking system'
  },
  'default': {
    url: 'https://neiveralvarez.site/demo',
    description: 'interactive project demos and case studies'
  }
};

// Common problems by industry (fallback when no research)
const COMMON_PROBLEMS = {
  'E-commerce': [
    'checkout with too many steps',
    'abandoned carts not being recovered',
    'slow product pages',
    'no automatic upsells'
  ],
  'SaaS': [
    'confusing onboarding causing churn',
    'dashboard without clear metrics',
    'no failed payment automation',
    'signup process with friction'
  ],
  'Real Estate': [
    'slow property search',
    'no smart filters',
    'contact forms nobody fills out',
    'no integrated virtual tours'
  ],
  'Technology': [
    'landing page that doesn\'t convert',
    'no interactive demo',
    'manual sales process',
    'no CRM integration'
  ],
  'default': [
    'website that doesn\'t generate leads',
    'forms without automatic follow-up',
    'no conversion tracking',
    'outdated design'
  ]
};

// ====== EMAIL GENERATORS BY TYPE ======

/**
 * Email 1: "The Detective" - Mention specific problem detected
 */
async function generateDetectiveEmail(lead, research = {}) {
  const problem = research.detectedProblem || 
    getRandomProblem(lead.industry);
  
  const prompt = `
Write an email of MAXIMUM 80 words for ${lead.name} at ${lead.company}.
Industry: ${lead.industry}
Role: ${lead.job_title || 'professional'}

Problem detected: ${problem}

STRICT RULES:
- Start with "Hey ${getFirstName(lead.name)}," or "Hi ${getFirstName(lead.name)},"
- Mention the problem casually, as if you noticed it out of curiosity
- DON'T sell anything - just offer to do a quick free analysis
- End with a simple question
- Sign with just "Neiver" (signature will be added automatically)
- Tone: like a colleague writing from their laptop at a coffee shop
- NO emojis, NO bullets, NO HTML formatting
- Write like a long text message, not a corporate email
- DON'T use phrases like "hope you're doing well" or "reaching out"
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are a freelance developer who writes casual, direct emails. You never sound salesy. You write like you talk.'
      },
      { role: 'user', content: prompt }
    ],
    temperature: 0.9,
    max_tokens: 200
  });

  return {
    subject: generateNaturalSubject(lead, 'detective'),
    body: response.choices[0].message.content.trim(),
    type: 'detective'
  };
}

/**
 * Email 2: "The Resource" - Share something useful for free
 */
async function generateResourceEmail(lead, research = {}) {
  const prompt = `
Write an email of MAXIMUM 70 words for ${lead.name} at ${lead.company}.
Industry: ${lead.industry}

CONTEXT: I already wrote 3 days ago about a problem on their site. Now sending something useful.

STRICT RULES:
- Start casual: "Hey again" or "Hey ${getFirstName(lead.name)}"
- Mention that I found/made something that might help
- Offer a specific tip or resource (not a link, just the idea)
- DON'T ask for anything in return
- End with something like "If it helps, great. If not, no worries"
- Sign with just "Neiver" (signature will be added automatically)
- Ultra casual tone, like texting
- MAXIMUM 70 words
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are a developer who genuinely wants to help. You don\'t sell. You share knowledge like you would with a friend.'
      },
      { role: 'user', content: prompt }
    ],
    temperature: 0.9,
    max_tokens: 150
  });

  return {
    subject: generateNaturalSubject(lead, 'resource'),
    body: response.choices[0].message.content.trim(),
    type: 'resource'
  };
}

/**
 * Email 3: "The Demo" - Link to relevant demo
 */
async function generateDemoEmail(lead, research = {}) {
  const demo = DEMOS[lead.industry] || DEMOS['default'];
  
  const prompt = `
Write an email of MAXIMUM 60 words for ${lead.name} at ${lead.company}.
Industry: ${lead.industry}

CONTEXT: We've already exchanged emails. Now showing something I built.

Demo available: ${demo.description}

STRICT RULES:
- Very short and direct
- Mention I built a prototype/demo thinking about their case
- Say they can reply to see it (no link needed)
- Clarify I did it for practice/portfolio, no commitment
- End with something light, maybe a bit of humor
- Sign with just "Neiver" (signature will be added automatically)
- NO elaborate formatting
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are a developer showing your work. You\'re proud but don\'t brag. You\'re casual and approachable.'
      },
      { role: 'user', content: prompt }
    ],
    temperature: 0.85,
    max_tokens: 150
  });

  return {
    subject: generateNaturalSubject(lead, 'demo'),
    body: response.choices[0].message.content.trim(),
    type: 'demo'
  };
}

/**
 * Email 4: "The Case" - Story of a similar client
 */
async function generateCaseEmail(lead, research = {}) {
  const caseStudy = getCaseStudyForIndustry(lead.industry);
  
  const prompt = `
Write an email of MAXIMUM 80 words for ${lead.name} at ${lead.company}.
Industry: ${lead.industry}

CONTEXT: Telling a real story about a similar client.

Story: ${caseStudy.story}
Result: ${caseStudy.result}

STRICT RULES:
- Start by mentioning I remembered their case
- Tell the story in 2-3 sentences max
- The result should sound real, not exaggerated
- Ask if their situation is similar
- DON'T make a sales pitch
- Sign with just "Neiver" (signature will be added automatically)
- Tone: like telling a friend about a project
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You tell stories naturally. You don\'t exaggerate results. You\'re honest about what worked.'
      },
      { role: 'user', content: prompt }
    ],
    temperature: 0.85,
    max_tokens: 180
  });

  return {
    subject: generateNaturalSubject(lead, 'case'),
    body: response.choices[0].message.content.trim(),
    type: 'case'
  };
}

/**
 * Email 5: "The Question" - A direct question
 */
async function generateQuestionEmail(lead, research = {}) {
  const prompt = `
Write an email of MAXIMUM 40 words for ${lead.name} at ${lead.company}.
Industry: ${lead.industry}
Role: ${lead.job_title || 'leader'}

STRICT RULES:
- ONLY one direct question about their situation/priorities
- Could be about: if they're planning improvements, if conversion is a priority, if they have an internal team
- Maximum 2-3 sentences before the question
- The question should be easy to answer (yes/no or one line)
- Sign with just "Neiver" (signature will be added automatically)
- Tone: curious, not salesy
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You ask smart questions that make people think. You don\'t interrogate. You show genuine interest.'
      },
      { role: 'user', content: prompt }
    ],
    temperature: 0.9,
    max_tokens: 100
  });

  return {
    subject: generateNaturalSubject(lead, 'question'),
    body: response.choices[0].message.content.trim(),
    type: 'question'
  };
}

/**
 * Email 6: "The Friend" - Casual goodbye
 */
async function generateFriendEmail(lead, research = {}) {
  const prompt = `
Write an email of MAXIMUM 50 words for ${lead.name} at ${lead.company}.

CONTEXT: This is the last email. No response. I'm saying goodbye without resentment.

STRICT RULES:
- DON'T say "closing your file" or anything passive-aggressive
- Simply say I understand it's not the right time
- Leave the door genuinely open
- You can wish them success with something specific to their industry
- Sign with just "Neiver" (signature will be added automatically)
- Tone: like saying goodbye to someone you met at an event
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You say goodbye with class. No resentment. You genuinely wish the best. You\'re professional but human.'
      },
      { role: 'user', content: prompt }
    ],
    temperature: 0.85,
    max_tokens: 120
  });

  return {
    subject: generateNaturalSubject(lead, 'friend'),
    body: response.choices[0].message.content.trim(),
    type: 'friend'
  };
}

// ====== HELPER FUNCTIONS ======

function getFirstName(fullName) {
  if (!fullName) return '';
  return fullName.split(' ')[0];
}

function getRandomProblem(industry) {
  const problems = COMMON_PROBLEMS[industry] || COMMON_PROBLEMS['default'];
  return problems[Math.floor(Math.random() * problems.length)];
}

function generateNaturalSubject(lead, type) {
  const firstName = getFirstName(lead.name);
  const company = lead.company !== 'Unknown' ? lead.company : '';
  
  const subjects = {
    detective: [
      `${company}`,
      `quick question`,
      `${firstName}`,
      `saw something on your site`
    ],
    resource: [
      `re: ${company}`,
      `this might help`,
      `found something`
    ],
    demo: [
      `built something for you`,
      `check this out`,
      `${company} prototype`
    ],
    case: [
      `thought of you`,
      `similar story`,
      `${firstName} - this happened`
    ],
    question: [
      `question`,
      `${firstName}?`,
      `one thing`
    ],
    friend: [
      `${firstName}`,
      `good luck`,
      `take care`
    ]
  };
  
  const options = subjects[type] || subjects.detective;
  return options[Math.floor(Math.random() * options.length)];
}

function getCaseStudyForIndustry(industry) {
  const cases = {
    'E-commerce': {
      story: 'I worked with a clothing store that was losing 70% of carts. We simplified checkout to 2 steps.',
      result: 'They recovered 23% more sales in the first month'
    },
    'SaaS': {
      story: 'An HR SaaS had 40% churn in the first month. We redesigned onboarding with progressive tooltips.',
      result: 'Dropped churn to 18% in 90 days'
    },
    'Real Estate': {
      story: 'A real estate agency was getting 10 leads per month from their site. We added smart filters and chat.',
      result: 'Now they get 50+ qualified leads'
    },
    'Technology': {
      story: 'A tech startup had a landing page nobody understood. We simplified it to one clear message.',
      result: 'Signups increased 3x'
    },
    'default': {
      story: 'A services company depended 100% on referrals. I built them a web lead capture system.',
      result: '40% of new clients now come from the site'
    }
  };
  
  return cases[industry] || cases['default'];
}

// ====== MAIN FUNCTION ======

/**
 * Generate a personalized email using OpenAI
 * @param {Object} lead - Lead data
 * @param {string} emailType - Email type (detective, resource, demo, case, question, friend)
 * @param {Object} research - Lead research data (optional)
 */
export async function generatePersonalizedEmail(lead, emailType, research = {}) {
  const generators = {
    'detective': generateDetectiveEmail,
    'resource': generateResourceEmail,
    'demo': generateDemoEmail,
    'case': generateCaseEmail,
    'question': generateQuestionEmail,
    'friend': generateFriendEmail,
    // Aliases for compatibility
    'initial': generateDetectiveEmail,
    'follow-up-1': generateResourceEmail,
    'follow-up-2': generateDemoEmail,
    'follow-up-3': generateCaseEmail,
    'follow-up-4': generateQuestionEmail,
    'breakup': generateFriendEmail
  };
  
  const generator = generators[emailType];
  if (!generator) {
    throw new Error(`Unknown email type: ${emailType}`);
  }
  
  try {
    const email = await generator(lead, research);
    
    // Final cleanup - ensure no HTML or weird formatting
    email.body = cleanEmailBody(email.body);
    
    // Add signature to all emails
    email.body = email.body + SIGNATURE;
    
    return email;
  } catch (error) {
    console.error(`Error generating ${emailType} email for ${lead.name}:`, error);
    throw error;
  }
}

function cleanEmailBody(body) {
  return body
    .replace(/<[^>]*>/g, '') // Remove HTML
    .replace(/\*\*/g, '')     // Remove bold markdown
    .replace(/\*/g, '')       // Remove italics
    .replace(/#{1,6}\s/g, '') // Remove markdown headers
    .replace(/^Subject:.*\n?/gm, '') // Remove "Subject:" lines GPT sometimes adds
    .replace(/^Dear\s+/gm, 'Hey ') // Replace "Dear X" with "Hey X"
    .replace(/^Hello\s+/gm, 'Hey ') // Replace "Hello X" with "Hey X"
    .replace(/\nBest,?\n?/gi, '\n') // Remove "Best,"
    .replace(/\nBest regards,?\n?/gi, '\n') // Remove "Best regards,"
    .replace(/\nKind regards,?\n?/gi, '\n') // Remove "Kind regards,"
    .replace(/\nSincerely,?\n?/gi, '\n') // Remove "Sincerely,"
    .replace(/\nWarm regards,?\n?/gi, '\n') // Remove "Warm regards,"
    .replace(/\n{3,}/g, '\n\n') // Max 2 blank lines
    .trim();
}

// ====== BATCH GENERATION ======

/**
 * Generate emails for multiple leads in batch
 */
export async function generateBatchEmails(leads, emailType, research = {}) {
  const results = [];
  
  for (const lead of leads) {
    try {
      const email = await generatePersonalizedEmail(lead, emailType, research[lead.email] || {});
      results.push({
        lead,
        email,
        success: true
      });
      
      // Rate limiting - wait between calls
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      results.push({
        lead,
        error: error.message,
        success: false
      });
    }
  }
  
  return results;
}

export default {
  generatePersonalizedEmail,
  generateBatchEmails,
  DEMOS
};
