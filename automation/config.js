// ⚙️ AUTOMATION CONFIGURATION
// Main configuration file for the intelligent email outreach system

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const CONFIG = {
  // API Keys (stored in GitHub Secrets)
  APIFY_API_KEY: process.env.APIFY_API_KEY,
  APIFY_DATASET_ID: 'Yb5WnpF2LgG4V4vvH',
  APIFY_ACTOR_ID: 'code_crafter/leads-finder',
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  
  // OpenAI Configuration
  OPENAI: {
    MODEL: 'gpt-4',
    TEMPERATURE: 0.9,
    MAX_TOKENS: 200,
    ENABLE_AI_PERSONALIZATION: true
  },
  
  // Email Configuration
  FROM_EMAIL: 'info@neiveralvarez.site',
  FROM_NAME: 'Neiver Alvarez',
  FORWARD_TO: 'convoycubano@gmail.com',
  REPLY_TO: 'convoycubano@gmail.com', // Replies go directly to Gmail
  
  // Rate Limiting (Domain Protection)
  RATE_LIMITS: {
    DAY_1_3: 10,    // Warm-up phase
    DAY_4_7: 20,    // Initial ramp
    DAY_8_14: 30,   // Mid ramp
    DAY_15_PLUS: 50 // Full capacity (MAX)
  },
  
  // Current day (will be calculated from start date)
  START_DATE: '2026-01-24', // Update when going live
  
  // Sending Schedule (prevent weekend/night sends)
  SENDING_HOURS: {
    START: 9,  // 9 AM
    END: 17    // 5 PM
  },
  SENDING_DAYS: [1, 2, 3, 4, 5], // Monday-Friday
  
  // Campaign Sequences - Nueva secuencia "El Consultor Amigo"
  SEQUENCES: {
    DETECTIVE: {
      delay: 0,
      template: 'detective',
      description: 'Menciono problema específico detectado'
    },
    RESOURCE: {
      delay: 3, // días después del inicial
      template: 'resource',
      description: 'Comparto algo útil gratis'
    },
    DEMO: {
      delay: 7, // días después del inicial
      template: 'demo',
      description: 'Link a demo relevante'
    },
    CASE: {
      delay: 11, // días después del inicial
      template: 'case',
      description: 'Historia de cliente similar'
    },
    QUESTION: {
      delay: 15, // días después del inicial
      template: 'question',
      description: 'Una pregunta directa'
    },
    FRIEND: {
      delay: 21, // días después del inicial
      template: 'friend',
      description: 'Despedida casual sin venta'
    }
  },
  
  // Mapeo de secuencia para compatibilidad
  SEQUENCE_ORDER: ['detective', 'resource', 'demo', 'case', 'question', 'friend'],
  
  // Lead Scoring Criteria
  SCORING: {
    HIGH_VALUE_TITLES: [
      'CEO', 'CTO', 'Founder', 'Co-Founder', 'VP Engineering',
      'VP Product', 'Chief Technology Officer', 'Chief Executive Officer'
    ],
    MEDIUM_VALUE_TITLES: [
      'Director', 'Engineering Manager', 'Product Manager',
      'Technical Lead', 'Head of Engineering', 'Head of Product'
    ],
    HIGH_VALUE_INDUSTRIES: [
      'SaaS', 'Technology', 'Startup', 'E-commerce', 'Fintech'
    ]
  },
  
  // Lead Resurrection Settings
  RESURRECTION: {
    ENABLED: true,
    COOL_DOWN_DAYS: 90, // Wait 90 days before resurrecting
    MAX_RESURRECTIONS: 2, // Maximum times to resurrect a lead
    MIN_LEADS_THRESHOLD: 50, // Trigger resurrection when below this
    RESURRECTION_MESSAGE: 'resurrection' // Special template
  },
  
  // Data Files (stored in /data directory)
  DATA_FILES: {
    LEADS: path.resolve(__dirname, '../data/leads.json'),
    CAMPAIGNS: path.resolve(__dirname, '../data/campaigns.json'),
    SENT: path.resolve(__dirname, '../data/sent.json'),
    ANALYTICS: path.resolve(__dirname, '../data/analytics.json'),
    UNSUBSCRIBED: path.resolve(__dirname, '../data/unsubscribed.json')
  },
  
  // Safety Limits
  SAFETY: {
    MAX_DAILY_SENDS: 50,
    MAX_HOURLY_SENDS: 10,
    BOUNCE_RATE_THRESHOLD: 0.05, // 5% - pause if exceeded
    SPAM_RATE_THRESHOLD: 0.01 // 1% - pause if exceeded
  },
  
  // Personalization Settings
  PERSONALIZATION: {
    TIER_1_VARIABLES: ['name', 'company', 'job_title', 'specific_project', 'tech_stack', 'recent_post'],
    TIER_2_VARIABLES: ['name', 'company', 'industry', 'job_title', 'relevant_case'],
    TIER_3_VARIABLES: ['name', 'company', 'industry']
  },
  
  // Portfolio Projects (for smart matching)
  PORTFOLIO_PROJECTS: [
    {
      name: 'E-commerce Platform',
      tech: ['React', 'Node.js', 'Stripe'],
      industry: ['E-commerce', 'Retail'],
      description: 'Full-stack e-commerce with payment integration',
      demoUrl: 'https://demo.neiveralvarez.site/ecommerce'
    },
    {
      name: 'SaaS Dashboard',
      tech: ['React', 'TypeScript', 'Tailwind'],
      industry: ['SaaS', 'Technology'],
      description: 'Enterprise-grade analytics dashboard',
      demoUrl: 'https://demo.neiveralvarez.site/saas'
    },
    {
      name: 'Real Estate Platform',
      tech: ['Next.js', 'PostgreSQL', 'Maps API'],
      industry: ['Real Estate', 'PropTech'],
      description: 'Property listing with advanced search',
      demoUrl: 'https://demo.neiveralvarez.site/realestate'
    },
    {
      name: 'Booking System',
      tech: ['React', 'Node.js', 'Calendar API'],
      industry: ['Services', 'Healthcare', 'Fitness'],
      description: 'Smart appointment scheduling',
      demoUrl: 'https://demo.neiveralvarez.site/booking'
    },
    {
      name: 'ROI Calculator',
      tech: ['React', 'TypeScript'],
      industry: ['default'],
      description: 'Interactive ROI projection tool',
      demoUrl: 'https://demo.neiveralvarez.site/roi'
    }
  ],
  
  // Demos por industria
  DEMOS: {
    'E-commerce': 'https://neiveralvarez.site/demo',
    'Retail': 'https://neiveralvarez.site/demo',
    'SaaS': 'https://neiveralvarez.site/demo',
    'Technology': 'https://neiveralvarez.site/demo',
    'Real Estate': 'https://neiveralvarez.site/demo',
    'PropTech': 'https://neiveralvarez.site/demo',
    'Services': 'https://neiveralvarez.site/demo',
    'Healthcare': 'https://neiveralvarez.site/demo',
    'default': 'https://neiveralvarez.site/demo'
  },
  
  // Analytics Tracking
  ANALYTICS: {
    TRACK_OPENS: true,
    TRACK_CLICKS: true,
    TRACK_REPLIES: true,
    WEEKLY_REPORT: true,
    MONTHLY_REPORT: true
  }
};

// Calculate current daily limit based on days since start
export function getCurrentDailyLimit() {
  const startDate = new Date(CONFIG.START_DATE);
  const today = new Date();
  const daysSinceStart = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  
  if (daysSinceStart <= 3) return CONFIG.RATE_LIMITS.DAY_1_3;
  if (daysSinceStart <= 7) return CONFIG.RATE_LIMITS.DAY_4_7;
  if (daysSinceStart <= 14) return CONFIG.RATE_LIMITS.DAY_8_14;
  return CONFIG.RATE_LIMITS.DAY_15_PLUS;
}

// Check if current time is within sending hours
export function isWithinSendingHours() {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();
  
  return CONFIG.SENDING_DAYS.includes(day) &&
         hour >= CONFIG.SENDING_HOURS.START &&
         hour < CONFIG.SENDING_HOURS.END;
}

// Calculate lead tier based on job title and industry
export function calculateLeadTier(jobTitle, industry) {
  const titleUpper = jobTitle.toUpperCase();
  
  if (CONFIG.SCORING.HIGH_VALUE_TITLES.some(t => titleUpper.includes(t.toUpperCase()))) {
    return 1;
  }
  
  if (CONFIG.SCORING.MEDIUM_VALUE_TITLES.some(t => titleUpper.includes(t.toUpperCase()))) {
    return 2;
  }
  
  return 3;
}

export default CONFIG;
