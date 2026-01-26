// 📧 Send preview emails to review
import { Resend } from 'resend';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { personalizeLead } from './email-personalizer.js';
import { CONFIG } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resend = new Resend(process.env.RESEND_API_KEY);

// Sample leads for each tier
const sampleLeads = [
  {
    name: 'James Jack',
    company: 'UBS',
    job_title: 'Managing Director',
    industry: 'Financial Services',
    tier: 1,
    tags: ['financial services']
  },
  {
    name: 'Sarah Chen',
    company: 'TechFlow',
    job_title: 'Engineering Manager',
    industry: 'Technology',
    tier: 2,
    tags: ['technology']
  },
  {
    name: 'Mike Wilson',
    company: 'StartupXYZ',
    job_title: 'Business Owner',
    industry: 'E-commerce',
    tier: 3,
    tags: ['e-commerce']
  }
];

async function sendPreviewEmails() {
  console.log('📧 Sending preview emails to convoycubano@gmail.com...\n');

  for (const lead of sampleLeads) {
    const data = personalizeLead(lead, 'initial');
    const templatePath = path.resolve(__dirname, `templates/tier${lead.tier}-initial.html`);
    let template = await fs.readFile(templatePath, 'utf-8');

    // Replace variables
    template = template.replace(/{{firstName}}/g, data.firstName);
    template = template.replace(/{{hook}}/g, data.hook);
    template = template.replace(/{{valueProposition}}/g, data.valueProposition);
    template = template.replace(/{{caseStudy\.result}}/g, data.caseStudy?.result || '');
    template = template.replace(/{{cta}}/g, data.cta);

    try {
      const result = await resend.emails.send({
        from: `${CONFIG.FROM_NAME} <${CONFIG.FROM_EMAIL}>`,
        to: 'convoycubano@gmail.com',
        subject: `[PREVIEW TIER ${lead.tier}] ${data.subject}`,
        html: template
      });

      console.log(`✅ Tier ${lead.tier} sent - Subject: "${data.subject}"`);
    } catch (error) {
      console.error(`❌ Tier ${lead.tier} failed:`, error.message);
    }
  }

  console.log('\n✅ Done! Check convoycubano@gmail.com');
}

sendPreviewEmails();
