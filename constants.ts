import { Project } from './types';

export const COMPANY_NAME = "OMNIA";
export const DEVELOPER_NAME = "Neiver Álvarez";
export const TITLE = "Senior Full Stack Engineer & CEO";
export const EXPERIENCE_YEARS = 15;

// Profile image
export const PROFILE_IMAGE = "/images/neiver.jpg"; 

export const CONTACT_INFO = {
  address: "1000 Brickell Ave, Miami FL 33131",
  email: "info@neiveralvarezdev.com",
  emailBusiness: "business@neiveralvarez.dev",
  phone: "786-987-6934",
  whatsapp: "1-786-543-2478",
  whatsappUrl: "https://wa.me/17865432478",
  website: "https://omnia.tech",
  linkedin: "https://www.linkedin.com/in/neiveralvarez/",
  calendly: "https://calendly.com/convoycubano/neiver-alvarez-dev"
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
    icon: 'CarFront',
    image: 'production'
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
    icon: 'Gem',
    image: 'production'
  },
  { 
    id: '16', 
    name: 'TikSale AI', 
    url: 'https://tiksaleai.com',
    description: 'Social commerce analytics tool powered by predictive AI models. Scrapes and analyzes trend data to optimize ad spend ROI.',
    icon: 'Bot',
    image: 'production'
  },
];

// Services offered
export const SERVICES = [
  {
    id: 1,
    name: "Web Development",
    icon: "Globe",
    description: "Custom websites and web applications built with modern frameworks",
    features: ["React/Next.js", "Responsive Design", "SEO Optimized", "E-commerce Integration"],
    price: "Starting at $5,000",
    popular: false
  },
  {
    id: 2,
    name: "Enterprise Solutions",
    icon: "Building2",
    description: "Scalable systems for growing businesses and corporations",
    features: ["Cloud Architecture", "API Development", "Database Design", "DevOps & CI/CD"],
    price: "Starting at $15,000",
    popular: true
  },
  {
    id: 3,
    name: "AI Integration",
    icon: "Brain",
    description: "Intelligent automation and machine learning solutions",
    features: ["LLM Integration", "Predictive Analytics", "Chatbot Development", "Data Processing"],
    price: "Custom Quote",
    popular: false
  }
];

// Testimonials
export const TESTIMONIALS = [
  {
    id: 1,
    name: "Marcus Rodriguez",
    role: "CEO, TradeBot Hub",
    company: "TradeBotHub",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    text: "Neiver and his team delivered a high-frequency trading platform that exceeded our expectations. The system handles thousands of transactions per second flawlessly.",
    rating: 5
  },
  {
    id: 2,
    name: "Sofia Chen",
    role: "Founder, Boostify Music",
    company: "BoostifyMusic",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    text: "Our artist platform went from concept to launch in just 8 weeks. The attention to detail and technical expertise is unmatched.",
    rating: 5
  },
  {
    id: 3,
    name: "David Thompson",
    role: "Director, Prime Vision Studios",
    company: "PrimeVision",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    text: "Working with OMNIA was a game-changer. They optimized our media delivery network and reduced our costs by 40%.",
    rating: 5
  }
];

// FAQ
export const FAQS = [
  {
    id: 1,
    question: "What is your typical project timeline?",
    answer: "Project timelines vary based on complexity. A standard landing page takes 2-3 weeks, while complex web applications can take 2-3 months. We provide detailed timelines during our discovery phase."
  },
  {
    id: 2,
    question: "Do you offer ongoing maintenance and support?",
    answer: "Yes! We offer maintenance packages that include bug fixes, security updates, performance monitoring, and feature enhancements. All projects include 30 days of free support post-launch."
  },
  {
    id: 3,
    question: "What technologies do you specialize in?",
    answer: "We specialize in React, Next.js, Node.js, Python, and modern cloud infrastructure (AWS, GCP). We choose the best technology stack based on your specific project requirements."
  },
  {
    id: 4,
    question: "Can you work with our existing team?",
    answer: "Absolutely! We excel at collaborating with in-house teams. Whether you need extra development capacity, technical leadership, or architectural guidance, we integrate seamlessly."
  },
  {
    id: 5,
    question: "What is your payment structure?",
    answer: "We typically work with a 50% upfront deposit and 50% upon completion for fixed-price projects. For larger projects, we offer milestone-based payments. We accept wire transfers, credit cards, and cryptocurrency."
  },
  {
    id: 6,
    question: "Do you sign NDAs and work agreements?",
    answer: "Yes, we're happy to sign NDAs and customized service agreements. We take confidentiality and intellectual property rights very seriously."
  }
];

// Work process steps
export const PROCESS_STEPS = [
  {
    id: 1,
    title: "Discovery & Planning",
    description: "We analyze your requirements, define goals, and create a detailed roadmap",
    duration: "1-2 weeks"
  },
  {
    id: 2,
    title: "Design & Architecture",
    description: "Wireframes, mockups, and technical architecture are crafted and approved",
    duration: "1-3 weeks"
  },
  {
    id: 3,
    title: "Development & Testing",
    description: "Agile development sprints with regular updates and quality assurance",
    duration: "4-12 weeks"
  },
  {
    id: 4,
    title: "Launch & Support",
    description: "Deployment to production with monitoring and post-launch support",
    duration: "Ongoing"
  }
];