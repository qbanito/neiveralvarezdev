import { Project } from './types';

export const COMPANY_NAME = "OMNIA";
export const DEVELOPER_NAME = "Neiver Álvarez";
export const TITLE = "Senior Full Stack Engineer & CEO";
export const EXPERIENCE_YEARS = 15;

// NOTE: Replace this URL with the URL of your uploaded image.
// Currently using a placeholder that matches the "Executive in Luxury Office" description.
export const PROFILE_IMAGE = "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=2000"; 

export const CONTACT_INFO = {
  address: "1000 Brickell Ave, Miami FL 33131",
  email: "contact@omnia.tech",
  phone: "786-987-6934",
  whatsapp: "1-786-543-2478",
  whatsappUrl: "https://wa.me/17865432478",
  website: "https://omnia.tech"
};

export const RESUME_DATA = {
  summary: "Visionary Senior Full Stack Engineer with 15+ years of experience architecting scalable web solutions and leading high-performance development teams. Founder of OMNIA, specializing in transforming complex business requirements into elegant, robust digital ecosystems.",
  skills: [
    "React / Next.js", "TypeScript", "Node.js / Express", "Python / Django",
    "Cloud Architecture (AWS/GCP)", "Database Design (SQL/NoSQL)",
    "AI & LLM Integration", "DevOps & CI/CD", "Team Leadership"
  ],
  experience: [
    {
      role: "CEO & Lead Architect",
      company: "Omnia Development",
      period: "2018 - Present",
      description: "Leading a boutique software agency in Miami. Architecting enterprise-grade solutions for Real Estate and FinTech sectors. Managed delivery of 50+ successful projects."
    },
    {
      role: "Senior Full Stack Engineer",
      company: "TechFlow Innovations",
      period: "2015 - 2018",
      description: "Spearheaded the migration of legacy monoliths to microservices architecture. Improved system throughput by 300% and reduced deployment times by 70%."
    },
    {
      role: "Lead Frontend Developer",
      company: "Creative Digital Corp",
      period: "2012 - 2015",
      description: "Directed frontend strategy for high-traffic e-commerce platforms. Implemented responsive design patterns and state management solutions."
    }
  ],
  education: [
    {
      degree: "Master in Computer Science",
      school: "Florida International University",
      year: "2012"
    },
    {
      degree: "Bachelor in Systems Engineering",
      school: "University of Technology",
      year: "2010"
    }
  ]
};

export const PROJECTS: Project[] = [
  { 
    id: '1', 
    name: 'TradeBot Hub', 
    url: 'https://tradebothub.com',
    description: 'High-frequency trading platform engineered with Node.js and Redis. Features sub-millisecond execution, WebSocket data streams, and ML-driven portfolio optimization.',
    icon: 'TrendingUp'
  },
  { 
    id: '2', 
    name: 'Boostify Music', 
    url: 'https://boostifymusic.com',
    description: 'Digital distribution ecosystem built on Next.js and Stripe Connect. Empowers artists with real-time analytics and direct-to-playlist marketing tools.',
    icon: 'Music'
  },
  { 
    id: '3', 
    name: 'Prime Vision Studios', 
    url: 'https://primevisionstudios.pro/',
    description: 'High-performance visual content network utilizing React and AWS CloudFront. Delivers 4K media assets with low-latency global caching.',
    icon: 'Video'
  },
  { 
    id: '4', 
    name: 'Omnia Tax', 
    url: 'https://omnia.tax',
    description: 'AI-powered tax preparation suite utilizing Python NLP for deduction discovery and military-grade encryption for secure data handling.',
    icon: 'Calculator'
  },
  { 
    id: '5', 
    name: 'Omnia Startups Lab', 
    url: 'https://omniastartupslab.com',
    description: 'Incubator management portal developed with Vue.js and Firebase. Streamlines investment tracking, resource allocation, and mentor communications.',
    icon: 'Rocket'
  },
  { 
    id: '6', 
    name: 'Effective Lead Marketing', 
    url: 'https://effectiveleadmarketing.com',
    description: 'High-velocity CRM dashboard featuring PostgreSQL data warehousing, real-time sales funnel visualization, and automated lead scoring.',
    icon: 'BarChart3'
  },
  { 
    id: '7', 
    name: 'Apex Miami Lux', 
    url: 'https://apexmiamilux.site',
    description: 'Immersive real estate showcase leveraging WebGL and Three.js for virtual tours, integrated with a headless CMS for rapid listing updates.',
    icon: 'Building'
  },
  { 
    id: '8', 
    name: 'Civic Guard', 
    url: 'https://civicguard.site',
    description: 'Community safety platform built with React Native and Geolocation API. Provides real-time incident mapping and emergency response alerts.',
    icon: 'Shield'
  },
  { 
    id: '9', 
    name: 'Snap Sell', 
    url: 'https://snapsell.site',
    description: 'P2P marketplace application with secure escrow logic. Optimized for mobile capability and rapid secure transaction processing.',
    icon: 'ShoppingCart'
  },
  { 
    id: '10', 
    name: 'Roofing Leads', 
    url: 'https://roofingleads.space',
    description: 'Automated lead generation funnel featuring A/B testing capabilities, instant SMS verification, and CRM integration for contractors.',
    icon: 'Home'
  },
  { 
    id: '11', 
    name: 'Growth Infrastructure', 
    url: 'https://growthinfrastructure.online',
    description: 'Cloud infrastructure audit dashboard. Visualizes AWS resources and automates scaling policies for enterprise clients to optimize costs.',
    icon: 'Cloud'
  },
  { 
    id: '12', 
    name: 'Construction Connect', 
    url: 'https://constructionconnect.site/',
    description: 'B2B supply chain network built on GraphQL. Connects contractors with suppliers for real-time inventory tracking and bidding.',
    icon: 'Hammer'
  },
  { 
    id: '13', 
    name: 'Auto Leads X', 
    url: 'https://autoleadsx.com',
    description: 'Automotive CRM integrating with dealer inventory feeds via XML/JSON APIs. Streamlines customer follow-ups and test drive scheduling.',
    icon: 'Car'
  },
  { 
    id: '14', 
    name: 'Vincenzo Moretti', 
    url: 'https://vincenzomoretti.com',
    description: 'Personal branding portfolio utilizing Gatsby for static site generation and Framer Motion for elegant, fluid UI transitions.',
    icon: 'User'
  },
  { 
    id: '15', 
    name: 'Lux Authentica', 
    url: 'https://luxauthentica.com',
    description: 'Web3 verification platform using Ethereum smart contracts (Solidity) to authenticate luxury goods and generate digital twins.',
    icon: 'Gem'
  },
  { 
    id: '16', 
    name: 'TikSale AI', 
    url: 'https://tiksaleai.com',
    description: 'Social commerce analytics tool powered by predictive AI models. Scrapes and analyzes trend data to optimize ad spend ROI.',
    icon: 'Bot'
  },
];