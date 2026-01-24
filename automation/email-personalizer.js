// 🎨 EMAIL PERSONALIZER - OPTIMIZED FOR RESULTS
// Authority + Result + Curiosity approach

import { CONFIG } from './config.js';

// Main personalization function
export function personalizeLead(lead, templateType = 'initial') {
  const tier = lead.tier;
  
  const personalizedData = {
    name: lead.name || 'there',
    firstName: getFirstName(lead.name),
    company: lead.company !== 'Unknown' ? lead.company : 'your company',
    industry: lead.industry,
    jobTitle: lead.job_title,
    
    subject: generateSubject(lead, templateType),
    hook: generateHook(lead),
    valueProposition: getValueProposition(lead),
    
    relevantProject: getRelevantProject(lead),
    caseStudy: getRelevantCaseStudy(lead),
    
    cta: getCTA(tier, templateType),
    tier: tier,
    isResurrection: lead.resurrection_count > 0
  };
  
  return personalizedData;
}

function getFirstName(fullName) {
  if (!fullName) return 'there';
  return fullName.split(' ')[0];
}

// OPTIMIZED Subject lines - every word counts
function generateSubject(lead, type) {
  const firstName = getFirstName(lead.name);
  const company = lead.company !== 'Unknown' ? lead.company : 'your company';
  
  const subjects = {
    initial: [
      `${company} + revenue`,
      `quick question`,
      `${firstName} — digital revenue`,
      `${company}'s conversions`
    ],
    'follow-up-1': [
      `re: ${company}`,
      `following up`,
      `still relevant?`
    ],
    'follow-up-2': [
      `closing the loop`,
      `last one`,
      `${firstName}?`
    ],
    breakup: [
      `closing your file`,
      `moving on`
    ],
    resurrection: [
      `${firstName} — new results`,
      `checking back`
    ]
  };
  
  const options = subjects[type] || subjects.initial;
  return options[Math.floor(Math.random() * options.length)];
}

// OPTIMIZED Hooks - direct pain, no fluff
function generateHook(lead) {
  const company = lead.company !== 'Unknown' ? lead.company : 'your company';
  
  const hooks = {
    tier1: [
      `Is ${company} leaving revenue on the table with poor conversion rates?`,
      `Quick question: is increasing digital revenue a priority for ${company} this quarter?`,
      `Most ${lead.industry} companies convert 2-3% of traffic. The rest is wasted spend.`
    ],
    tier2: [
      `Is ${company} converting traffic into revenue — or just collecting visits?`,
      `Most companies don't need a new website. They need their current one to make money.`,
      `Quick question about ${company}'s conversion rates.`
    ],
    tier3: [
      `Is ${company} getting revenue from your website — or just traffic?`,
      `Most sites convert under 3%. That's money left behind.`,
      `Quick question about turning your traffic into customers.`
    ]
  };
  
  const tierKey = `tier${lead.tier}`;
  const options = hooks[tierKey] || hooks.tier3;
  return options[Math.floor(Math.random() * options.length)];
}

// Get relevant project
function getRelevantProject(lead) {
  const matches = CONFIG.PORTFOLIO_PROJECTS.filter(project => {
    if (project.industry.some(ind => ind.toLowerCase() === lead.industry.toLowerCase())) {
      return true;
    }
    if (lead.tags && lead.tags.some(tag => 
      project.tech.some(tech => tech.toLowerCase().includes(tag.toLowerCase())))) {
      return true;
    }
    return false;
  });
  
  return matches.length > 0 ? matches[0] : CONFIG.PORTFOLIO_PROJECTS[0];
}

// Get case study with MONEY results
function getRelevantCaseStudy(lead) {
  const project = getRelevantProject(lead);
  return {
    title: project.name,
    description: project.description,
    tech: project.tech.join(', '),
    result: getCaseStudyResult(project)
  };
}

function getCaseStudyResult(project) {
  const results = {
    'E-commerce Platform': 'increased revenue 47% — same traffic, zero extra ad spend',
    'SaaS Dashboard': 'cut churn 32%, increased LTV 28%',
    'Real Estate Platform': '$2.1M additional revenue in 6 months'
  };
  return results[project.name] || 'increased conversions 67% in 90 days';
}

// OPTIMIZED Value Proposition - one punch, no fluff
function getValueProposition(lead) {
  const propositions = {
    tier1: `I build systems that turn traffic into revenue. Not websites — conversion engines.`,
    tier2: `I don't build websites. I build systems that make your existing traffic profitable.`,
    tier3: `I turn traffic into paying customers. No redesign. Just revenue.`
  };
  
  return propositions[`tier${lead.tier}`] || propositions.tier3;
}

// OPTIMIZED CTAs - curiosity, not ask
function getCTA(tier, templateType) {
  const ctas = {
    initial: {
      tier1: "Worth a look?",
      tier2: "Worth exploring?",
      tier3: "Interested?"
    },
    'follow-up-1': {
      tier1: "Still relevant?",
      tier2: "Make sense?",
      tier3: "Worth it?"
    },
    'follow-up-2': {
      tier1: "Should I send the case study?",
      tier2: "Want to see the numbers?",
      tier3: "Curious?"
    },
    breakup: {
      tier1: "Should I check back later — or close your file?",
      tier2: "Follow up later, or move on?",
      tier3: "Still on your radar?"
    }
  };
  
  return ctas[templateType]?.[`tier${tier}`] || "Worth it?";
}

export default { personalizeLead };
