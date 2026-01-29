// 🔬 LEAD ENRICHER - Deep analysis of each lead before outreach
// Scrapes website, analyzes with AI, and stores enriched data

import OpenAI from 'openai';
import { CONFIG } from './config.js';
import fs from 'fs/promises';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Enrich a lead with deep company analysis
 * @param {Object} lead - Basic lead data from Apify
 * @returns {Object} - Enriched lead with company insights
 */
export async function enrichLead(lead) {
  console.log(`🔬 Enriching lead: ${lead.name} (${lead.email})`);
  
  const enrichedData = {
    enriched_at: new Date().toISOString(),
    company_info: null,
    detected_problems: [],
    recommended_service: null,
    personalization_hooks: [],
    conversation_tone: 'casual',
    first_email_angle: null,
    tech_stack: [],
    company_size_estimate: null,
    urgency_indicators: []
  };

  try {
    // Step 1: Extract company name from website if missing
    if (lead.company === 'Unknown' && lead.company_website) {
      enrichedData.company_info = await analyzeCompanyWebsite(lead.company_website, lead);
      if (enrichedData.company_info?.company_name) {
        lead.company = enrichedData.company_info.company_name;
      }
    }

    // Step 2: Deep analysis with OpenAI
    const analysis = await deepLeadAnalysis(lead, enrichedData.company_info);
    
    enrichedData.detected_problems = analysis.problems || [];
    enrichedData.recommended_service = analysis.recommended_service;
    enrichedData.personalization_hooks = analysis.hooks || [];
    enrichedData.conversation_tone = analysis.tone || 'casual';
    enrichedData.first_email_angle = analysis.first_email_angle;
    enrichedData.urgency_indicators = analysis.urgency || [];

    // Step 3: Determine best first email variant
    enrichedData.recommended_variant = determineFirstEmailVariant(lead, analysis);

  } catch (error) {
    console.error(`❌ Error enriching ${lead.email}:`, error.message);
    // Use fallback enrichment
    enrichedData.detected_problems = getFallbackProblems(lead.industry);
    enrichedData.first_email_angle = getFallbackAngle(lead);
  }

  return enrichedData;
}

/**
 * Analyze company website to extract key information
 */
async function analyzeCompanyWebsite(websiteUrl, lead) {
  // In production, this would use Puppeteer/Playwright to actually scrape
  // For now, we use AI to infer based on available data
  
  const prompt = `
Based on this information about a potential client:
- Website: ${websiteUrl}
- Contact Name: ${lead.name}
- Job Title: ${lead.job_title}
- Industry: ${lead.industry}

Analyze and provide:
1. Company name (extract from website URL or infer)
2. What they likely sell/do (be specific)
3. Their target customer
4. Estimated company size (startup/small/medium/enterprise)
5. Key business metrics they care about

Respond in JSON format:
{
  "company_name": "string",
  "business_description": "one sentence",
  "products_services": ["list", "of", "offerings"],
  "target_customer": "who they sell to",
  "company_size": "startup|small|medium|enterprise",
  "key_metrics": ["metric1", "metric2"],
  "website_type": "ecommerce|saas|services|agency|other"
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert business analyst. Provide accurate, realistic assessments based on limited information.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 400
    });

    return JSON.parse(response.choices[0].message.content.trim());
  } catch (error) {
    console.error('Error analyzing website:', error.message);
    return null;
  }
}

/**
 * Deep lead analysis with OpenAI - the core intelligence
 */
async function deepLeadAnalysis(lead, companyInfo) {
  const prompt = `
You are helping me write a cold email to this person. Analyze deeply:

LEAD INFO:
- Name: ${lead.name}
- Job Title: ${lead.job_title}
- Company: ${lead.company}
- Industry: ${lead.industry}
- Website: ${lead.company_website || 'N/A'}
${companyInfo ? `- Business: ${companyInfo.business_description}` : ''}
${companyInfo ? `- Company Size: ${companyInfo.company_size}` : ''}

MY SERVICES (what I can offer):
1. Website optimization (speed, conversion, UX)
2. E-commerce development (Shopify, custom)
3. SaaS dashboards and web apps
4. AI/automation integration
5. Booking/scheduling systems

ANALYZE AND PROVIDE:

1. THREE specific problems they likely have (be very specific based on their role/industry)
2. Which of my services would help them MOST
3. THREE personalization hooks I can use (specific to their situation)
4. Best conversation tone for this person (casual/professional/direct)
5. The BEST angle for my first email (problem/curiosity/value)
6. Any urgency indicators (seasonal, growth stage, etc.)

Respond in JSON:
{
  "problems": [
    {"problem": "specific problem", "severity": "high|medium|low", "how_i_solve": "my solution"}
  ],
  "recommended_service": "most relevant service",
  "hooks": ["specific hook 1", "specific hook 2", "specific hook 3"],
  "tone": "casual|professional|direct",
  "first_email_angle": "problem|curiosity|value",
  "urgency": ["urgency indicator if any"]
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a sales intelligence expert. Provide actionable, specific insights for cold outreach. Never be generic.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 600
    });

    return JSON.parse(response.choices[0].message.content.trim());
  } catch (error) {
    console.error('Error in deep analysis:', error.message);
    return {
      problems: [],
      recommended_service: 'website optimization',
      hooks: [],
      tone: 'casual',
      first_email_angle: 'problem'
    };
  }
}

/**
 * Determine which first email variant to use based on analysis
 */
function determineFirstEmailVariant(lead, analysis) {
  // Variant A: Problem-focused - best for high-severity issues
  // Variant B: Curiosity - best for executives/busy people
  // Variant C: Value-first - best for smaller companies

  const isExecutive = /CEO|CTO|Founder|VP|Director|Head/i.test(lead.job_title);
  const hasHighSeverityProblem = analysis.problems?.some(p => p.severity === 'high');
  const isSmallCompany = analysis.company_size === 'startup' || analysis.company_size === 'small';

  if (hasHighSeverityProblem && !isExecutive) {
    return 'A'; // Problem-focused
  } else if (isExecutive) {
    return 'B'; // Curiosity (respect their time)
  } else if (isSmallCompany) {
    return 'C'; // Value-first (free audit)
  } else {
    // Random for A/B testing
    const variants = ['A', 'B', 'C'];
    return variants[Math.floor(Math.random() * variants.length)];
  }
}

/**
 * Fallback problems by industry
 */
function getFallbackProblems(industry) {
  const problems = {
    'E-commerce': [
      { problem: 'Cart abandonment above industry average', severity: 'high', how_i_solve: 'Optimized 2-step checkout' },
      { problem: 'Slow mobile experience', severity: 'medium', how_i_solve: 'Performance optimization' },
      { problem: 'No automated upsells', severity: 'medium', how_i_solve: 'Smart recommendation engine' }
    ],
    'SaaS': [
      { problem: 'High first-month churn', severity: 'high', how_i_solve: 'Progressive onboarding flow' },
      { problem: 'Low trial-to-paid conversion', severity: 'high', how_i_solve: 'Activation optimization' },
      { problem: 'Manual customer success', severity: 'medium', how_i_solve: 'Automated health scoring' }
    ],
    'Financial Services': [
      { problem: 'Complex client onboarding', severity: 'high', how_i_solve: 'Streamlined digital intake' },
      { problem: 'Manual reporting processes', severity: 'medium', how_i_solve: 'Automated dashboards' },
      { problem: 'Poor mobile experience', severity: 'medium', how_i_solve: 'Mobile-first redesign' }
    ],
    'default': [
      { problem: 'Website not generating leads', severity: 'high', how_i_solve: 'Conversion optimization' },
      { problem: 'Outdated user experience', severity: 'medium', how_i_solve: 'Modern redesign' },
      { problem: 'No analytics tracking', severity: 'medium', how_i_solve: 'Analytics implementation' }
    ]
  };

  return problems[industry] || problems['default'];
}

/**
 * Fallback angle based on lead info
 */
function getFallbackAngle(lead) {
  if (/CEO|Founder/i.test(lead.job_title)) {
    return 'curiosity';
  } else if (/Marketing|Growth/i.test(lead.job_title)) {
    return 'value';
  } else {
    return 'problem';
  }
}

/**
 * Batch enrich multiple leads
 */
export async function enrichBatch(leads, options = {}) {
  const { maxConcurrent = 2, delayBetween = 1500 } = options;
  const results = [];

  console.log(`🔬 Starting batch enrichment for ${leads.length} leads...`);

  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];
    
    try {
      const enrichedData = await enrichLead(lead);
      lead.enriched_data = enrichedData;
      results.push({ lead, success: true });
      
      console.log(`✅ [${i + 1}/${leads.length}] Enriched: ${lead.name}`);
    } catch (error) {
      console.error(`❌ [${i + 1}/${leads.length}] Failed: ${lead.name} - ${error.message}`);
      results.push({ lead, success: false, error: error.message });
    }

    // Rate limiting
    if (i < leads.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delayBetween));
    }
  }

  console.log(`\n📊 Enrichment complete: ${results.filter(r => r.success).length}/${leads.length} successful`);
  return results;
}

/**
 * Update leads.json with enriched data
 */
export async function saveEnrichedLeads(leads) {
  try {
    const data = await fs.readFile(CONFIG.DATA_FILES.LEADS, 'utf-8');
    const leadsData = JSON.parse(data);

    for (const enrichedLead of leads) {
      const index = leadsData.leads.findIndex(l => l.email === enrichedLead.email);
      if (index !== -1) {
        leadsData.leads[index] = enrichedLead;
      }
    }

    leadsData.lastEnriched = new Date().toISOString();
    await fs.writeFile(CONFIG.DATA_FILES.LEADS, JSON.stringify(leadsData, null, 2));
    
    console.log(`💾 Saved ${leads.length} enriched leads`);
  } catch (error) {
    console.error('Error saving enriched leads:', error);
  }
}

export default {
  enrichLead,
  enrichBatch,
  saveEnrichedLeads
};
