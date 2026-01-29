// 🔍 LEAD RESEARCHER - Research each lead before contact
// Gathers website info, tech stack, and visible problems

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Research a lead and gather useful info for personalization
 * @param {Object} lead - Basic lead data
 * @returns {Object} - Researched information
 */
export async function researchLead(lead) {
  const research = {
    leadEmail: lead.email,
    company: lead.company,
    investigatedAt: new Date().toISOString(),
    websiteInfo: null,
    detectedProblems: [],
    techStack: [],
    opportunities: [],
    personalizedAngle: null
  };

  try {
    // Try to analyze website if we have domain
    if (lead.website || lead.company_website) {
      const websiteUrl = lead.website || lead.company_website;
      research.websiteInfo = await analyzeWebsite(websiteUrl, lead);
      research.detectedProblems = research.websiteInfo.problems || [];
      research.techStack = research.websiteInfo.techStack || [];
    }

    // Generate personalized angle with AI
    research.personalizedAngle = await generatePersonalizedAngle(lead, research);

  } catch (error) {
    console.error(`Error researching lead ${lead.email}:`, error.message);
    // Use fallback based on industry
    research.detectedProblems = getDefaultProblems(lead.industry);
    research.personalizedAngle = getDefaultAngle(lead);
  }

  return research;
}

/**
 * Analyze lead's website (simulated - in production would use scraping)
 */
async function analyzeWebsite(url, lead) {
  // In production, this would:
  // 1. Fetch site with Puppeteer/Playwright
  // 2. Speed analysis with Lighthouse
  // 3. Stack detection with BuiltWith API
  // 4. Screenshots for visual analysis
  
  // For now, we use AI to infer common problems
  const prompt = `
Based on this lead information:
- Company: ${lead.company}
- Industry: ${lead.industry}
- Contact's role: ${lead.job_title || 'unknown'}
- Website: ${url || 'not available'}

Generate a list of 3 COMMON technical problems their website probably has.
Problems should be:
1. Specific and technical (not generic)
2. Solvable by a developer
3. Related to conversion/revenue

Respond ONLY in JSON format:
{
  "problems": ["problem1", "problem2", "problem3"],
  "techStack": ["tech1", "tech2"],
  "mainOpportunity": "short description of main opportunity"
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert in web development and conversion optimization. You identify real technical problems.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    const content = response.choices[0].message.content.trim();
    return JSON.parse(content);
  } catch (error) {
    console.error('Error analyzing website:', error);
    return {
      problems: getDefaultProblems(lead.industry),
      techStack: [],
      mainOpportunity: null
    };
  }
}

/**
 * Generate personalized outreach angle
 */
async function generatePersonalizedAngle(lead, research) {
  const prompt = `
Lead info:
- Name: ${lead.name}
- Company: ${lead.company}
- Industry: ${lead.industry}
- Role: ${lead.job_title || 'professional'}
- Detected problems: ${research.detectedProblems.join(', ')}

Generate ONE personalized approach angle to contact this person.
The angle should:
1. Mention something specific to their industry/role
2. Connect with a real problem
3. Not sound salesy

Respond in ONE sentence of maximum 20 words.
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a consultative sales strategist. You create unique, relevant approach angles.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.9,
      max_tokens: 50
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    return null;
  }
}

/**
 * Default problems based on industry
 */
function getDefaultProblems(industry) {
  const defaults = {
    'E-commerce': [
      'checkout with too many steps causing abandonment',
      'product pages without social proof',
      'no automatic abandoned cart recovery'
    ],
    'SaaS': [
      'confusing onboarding causing early churn',
      'pricing page without ROI calculator',
      'no automatic trial or self-service demo'
    ],
    'Real Estate': [
      'slow property search without useful filters',
      'generic contact forms without qualification',
      'no virtual tour or optimized gallery'
    ],
    'Technology': [
      'confusing landing page that doesn\'t communicate value',
      'no interactive demo or clear use cases',
      'contact process with too much friction'
    ],
    'Retail': [
      'poor mobile experience',
      'no personalized recommendations',
      'checkout not optimized for conversion'
    ],
    'Services': [
      'no efficient online booking system',
      'contact forms without follow-up',
      'no visible social proof (testimonials, reviews)'
    ],
    'default': [
      'website that gets traffic but doesn\'t convert',
      'abandoned contact forms',
      'no conversion tracking implemented'
    ]
  };

  return defaults[industry] || defaults['default'];
}

/**
 * Default angle if AI fails
 */
function getDefaultAngle(lead) {
  const angles = {
    'E-commerce': `I noticed ${lead.company} has room to optimize their checkout flow`,
    'SaaS': `${lead.company} could reduce churn by improving initial onboarding`,
    'Real Estate': `The property search on ${lead.company} could be more efficient`,
    'Technology': `${lead.company}'s landing has potential to convert more`,
    'default': `${lead.company} might be leaving revenue on the table with their current web`
  };

  return angles[lead.industry] || angles['default'];
}

/**
 * Batch research for multiple leads
 */
export async function researchBatch(leads, options = {}) {
  const { 
    maxConcurrent = 3,
    delayBetween = 1000 
  } = options;
  
  const results = [];
  
  for (let i = 0; i < leads.length; i += maxConcurrent) {
    const batch = leads.slice(i, i + maxConcurrent);
    
    const batchResults = await Promise.all(
      batch.map(lead => researchLead(lead))
    );
    
    results.push(...batchResults);
    
    // Rate limiting
    if (i + maxConcurrent < leads.length) {
      await new Promise(resolve => setTimeout(resolve, delayBetween));
    }
  }
  
  return results;
}

/**
 * Enrich a lead with researched information
 */
export function enrichLeadWithResearch(lead, research) {
  return {
    ...lead,
    research: {
      investigatedAt: research.investigatedAt,
      detectedProblem: research.detectedProblems[0] || null,
      allProblems: research.detectedProblems,
      techStack: research.techStack,
      personalizedAngle: research.personalizedAngle,
      opportunity: research.websiteInfo?.mainOpportunity || null
    }
  };
}

export default {
  researchLead,
  researchBatch,
  enrichLeadWithResearch,
  getDefaultProblems
};
