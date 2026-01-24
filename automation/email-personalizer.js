// 🎨 EMAIL PERSONALIZER
// Intelligent personalization engine for cold emails

import { CONFIG } from './config.js';

// Main personalization function
export function personalizeLead(lead, templateType = 'initial') {
  const tier = lead.tier;
  
  const personalizedData = {
    // Basic variables (all tiers)
    name: lead.name || 'there',
    firstName: getFirstName(lead.name),
    company: lead.company,
    industry: lead.industry,
    jobTitle: lead.job_title,
    
    // Tier-specific variables
    ...getTierSpecificVariables(lead, tier),
    
    // Template-specific variables
    ...getTemplateVariables(lead, templateType),
    
    // Dynamic content
    relevantProject: getRelevantProject(lead),
    caseStudy: getRelevantCaseStudy(lead),
    techStack: getTechStackMention(lead),
    valueProposition: getValueProposition(lead),
    
    // CTA
    cta: getCTA(tier, templateType),
    
    // Metadata
    tier: tier,
    isResurrection: lead.resurrection_count > 0
  };
  
  return personalizedData;
}

// Get first name from full name
function getFirstName(fullName) {
  if (!fullName) return 'there';
  return fullName.split(' ')[0];
}

// Tier-specific personalization
function getTierSpecificVariables(lead, tier) {
  if (tier === 1) {
    return {
      executiveTouch: true,
      specificMention: getSpecificMention(lead),
      recentActivity: getRecentActivity(lead),
      customInsight: getCustomInsight(lead)
    };
  }
  
  if (tier === 2) {
    return {
      managerTouch: true,
      industryInsight: getIndustryInsight(lead.industry),
      teamBenefit: getTeamBenefit(lead)
    };
  }
  
  return {
    generalTouch: true,
    broadValue: getBroadValue(lead.industry)
  };
}

// Template-specific variables
function getTemplateVariables(lead, templateType) {
  switch (templateType) {
    case 'initial':
      return {
        subject: generateSubject(lead, 'initial'),
        hook: generateHook(lead),
        opener: generateOpener(lead)
      };
      
    case 'follow-up-1':
      return {
        subject: generateSubject(lead, 'follow-up-1'),
        valueAdd: generateValueAdd(lead),
        resource: generateResource(lead)
      };
      
    case 'follow-up-2':
      return {
        subject: generateSubject(lead, 'follow-up-2'),
        caseStudyBrief: generateCaseStudyBrief(lead),
        socialProof: generateSocialProof()
      };
      
    case 'breakup':
      return {
        subject: generateSubject(lead, 'breakup'),
        finalOffer: generateFinalOffer(lead)
      };
      
    case 'resurrection':
      return {
        subject: generateSubject(lead, 'resurrection'),
        comebackMessage: generateComebackMessage(lead),
        newValue: generateNewValue(lead)
      };
      
    default:
      return {};
  }
}

// Subject line generators
function generateSubject(lead, type) {
  const { firstName, company, industry } = lead;
  
  const subjects = {
    initial: [
      `Quick question about ${company}'s tech stack`,
      `${firstName} - Thought this might help`,
      `Interesting project for ${company}`,
      `${company} + modern web development`,
      `${firstName}, saw your work at ${company}`
    ],
    'follow-up-1': [
      `Sharing something useful for ${company}`,
      `${firstName} - Case study you might like`,
      `Quick follow-up about ${company}`,
      `Thought of ${company} when I saw this`
    ],
    'follow-up-2': [
      `One more thing, ${firstName}`,
      `${company}'s digital presence`,
      `Last thought about ${company}`
    ],
    breakup: [
      `Should I close your file, ${firstName}?`,
      `Last email, promise`,
      `Moving on from ${company}`,
      `Final question about ${company}`
    ],
    resurrection: [
      `${firstName}, checking back in`,
      `New portfolio work for ${company}`,
      `Updates since we last connected`,
      `${firstName} - Still interested?`
    ]
  };
  
  const options = subjects[type] || subjects.initial;
  return options[Math.floor(Math.random() * options.length)];
}

// Hook generators
function generateHook(lead) {
  const hooks = {
    tier1: [
      `I noticed ${lead.company} is ${getCompanyActivity(lead)} and thought you might be interested in how we helped similar companies scale their digital presence.`,
      `Quick question: Is ${lead.company} planning any major website/app updates this year?`,
      `Saw ${lead.company}'s recent ${getRecentActivity(lead)} - impressive work! I have an idea that might complement it.`
    ],
    tier2: [
      `I specialize in building ${lead.industry} solutions that ${getIndustryBenefit(lead.industry)}.`,
      `Working with ${lead.jobTitle}s in ${lead.industry}, I've noticed ${getIndustryChallenge(lead.industry)}.`,
      `Quick question about ${lead.company}'s development priorities.`
    ],
    tier3: [
      `I help ${lead.industry} companies build modern web solutions.`,
      `Reaching out to see if ${lead.company} needs development support.`,
      `I've been following ${lead.company} and wanted to connect.`
    ]
  };
  
  const tierKey = `tier${lead.tier}`;
  const options = hooks[tierKey] || hooks.tier3;
  return options[Math.floor(Math.random() * options.length)];
}

// Opener generators
function generateOpener(lead) {
  if (lead.tier === 1) {
    return `Hi ${getFirstName(lead.name)},`;
  }
  return `Hey ${getFirstName(lead.name)},`;
}

// Get relevant project
function getRelevantProject(lead) {
  const matches = CONFIG.PORTFOLIO_PROJECTS.filter(project => {
    // Match by industry
    if (project.industry.some(ind => ind.toLowerCase() === lead.industry.toLowerCase())) {
      return true;
    }
    // Match by tags
    if (lead.tags && lead.tags.some(tag => 
      project.tech.some(tech => tech.toLowerCase().includes(tag.toLowerCase())))) {
      return true;
    }
    return false;
  });
  
  return matches.length > 0 
    ? matches[0] 
    : CONFIG.PORTFOLIO_PROJECTS[0]; // Default to first project
}

// Get relevant case study
function getRelevantCaseStudy(lead) {
  const project = getRelevantProject(lead);
  return {
    title: project.name,
    description: project.description,
    tech: project.tech.join(', '),
    result: getCaseStudyResult(project)
  };
}

// Get case study result
function getCaseStudyResult(project) {
  const results = {
    'E-commerce Platform': '45% increase in conversions',
    'SaaS Dashboard': '3x faster load times',
    'Real Estate Platform': '10k+ monthly active users'
  };
  return results[project.name] || 'Significant performance improvement';
}

// Get tech stack mention
function getTechStackMention(lead) {
  if (lead.tags && lead.tags.length > 0) {
    const techTags = lead.tags.filter(tag => 
      ['react', 'node', 'typescript', 'nextjs', 'vue', 'angular'].includes(tag.toLowerCase())
    );
    if (techTags.length > 0) {
      return `I noticed you work with ${techTags.join(', ')}`;
    }
  }
  return `Modern tech stack`;
}

// Value proposition generators
function getValueProposition(lead) {
  const propositions = {
    tier1: `I specialize in building high-performance ${lead.industry} solutions that drive measurable results. Recently delivered a ${getRelevantProject(lead).name} that achieved ${getCaseStudyResult(getRelevantProject(lead))}.`,
    tier2: `I help ${lead.industry} companies modernize their tech stack and improve user experience. Expertise in React, Node.js, and full-stack development.`,
    tier3: `Full-stack developer specializing in modern web applications. Quick turnaround, clean code, scalable solutions.`
  };
  
  return propositions[`tier${lead.tier}`] || propositions.tier3;
}

// CTA generators
function getCTA(tier, templateType) {
  const ctas = {
    initial: {
      tier1: "Worth a 15-minute conversation?",
      tier2: "Open to a quick chat about this?",
      tier3: "Interested in learning more?"
    },
    'follow-up-1': {
      tier1: "Would you like to see the full case study?",
      tier2: "Should I send over more details?",
      tier3: "Want to see examples?"
    },
    'follow-up-2': {
      tier1: "Still worth exploring?",
      tier2: "Makes sense to connect?",
      tier3: "Interested?"
    },
    breakup: {
      tier1: "Should I check back in a few months?",
      tier2: "Should I follow up later?",
      tier3: "Still interested?"
    }
  };
  
  return ctas[templateType]?.[`tier${tier}`] || "Interested?";
}

// Helper functions for dynamic content
function getCompanyActivity(lead) {
  const activities = ['scaling', 'growing', 'expanding digitally', 'hiring', 'innovating'];
  return activities[Math.floor(Math.random() * activities.length)];
}

function getRecentActivity(lead) {
  if (lead.linkedin_url) return 'LinkedIn post';
  return 'growth';
}

function getSpecificMention(lead) {
  return `your work in ${lead.industry}`;
}

function getCustomInsight(lead) {
  return `${lead.industry} companies that invest in modern tech see 40% better customer retention`;
}

function getIndustryInsight(industry) {
  const insights = {
    'SaaS': 'user experience is the key differentiator',
    'E-commerce': 'site speed directly impacts conversion rates',
    'Technology': 'staying ahead requires continuous innovation',
    'Fintech': 'security and UX must work together',
    'default': 'digital presence defines competitive advantage'
  };
  return insights[industry] || insights.default;
}

function getTeamBenefit(lead) {
  return `help your team ship faster with better code quality`;
}

function getBroadValue(industry) {
  return `modern web solutions that drive results`;
}

function getIndustryBenefit(industry) {
  const benefits = {
    'SaaS': 'improve user retention and reduce churn',
    'E-commerce': 'increase conversion rates and AOV',
    'Technology': 'scale efficiently while maintaining quality',
    'default': 'achieve measurable business outcomes'
  };
  return benefits[industry] || benefits.default;
}

function getIndustryChallenge(industry) {
  const challenges = {
    'SaaS': 'balancing feature velocity with code quality is tough',
    'E-commerce': 'optimizing checkout flows requires expertise',
    'Technology': 'finding reliable development partners is challenging',
    'default': 'building scalable solutions takes experience'
  };
  return challenges[industry] || challenges.default;
}

function generateValueAdd(lead) {
  return `I put together a quick guide on "${getRelevantGuide(lead)}" that you might find useful.`;
}

function getRelevantGuide(lead) {
  const guides = {
    'SaaS': '5 UX Patterns That Reduce Churn',
    'E-commerce': 'Checkout Optimization Checklist',
    'Technology': 'Modern Web Development Best Practices',
    'default': 'Building Scalable Web Applications'
  };
  return guides[lead.industry] || guides.default;
}

function generateResource(lead) {
  return getRelevantProject(lead).description;
}

function generateCaseStudyBrief(lead) {
  const project = getRelevantProject(lead);
  return `Recently built a ${project.name} using ${project.tech.join(', ')} that achieved ${getCaseStudyResult(project)}.`;
}

function generateSocialProof() {
  return "Worked with startups and established companies to deliver production-ready solutions.";
}

function generateFinalOffer(lead) {
  if (lead.tier === 1) {
    return "Happy to revisit this in a few months if timing is better.";
  }
  return "Let me know if you'd like to connect in the future.";
}

function generateComebackMessage(lead) {
  return `I reached out ${lead.resurrection_count > 1 ? 'a while back' : 'a few months ago'} but wanted to check in with some new work.`;
}

function generateNewValue(lead) {
  return `Just completed a ${getRelevantProject(lead).name} that might interest ${lead.company}.`;
}

export default { personalizeLead };
