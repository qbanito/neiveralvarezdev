// 📧 EMAIL TEST - Send sample emails to review
import { Resend } from 'resend';
import fs from 'fs/promises';
import { CONFIG } from './config.js';
import { personalizeLead } from './email-personalizer.js';

const resend = new Resend(CONFIG.RESEND_API_KEY);

// Load leads
async function loadLeads() {
  const data = await fs.readFile(CONFIG.DATA_FILES.LEADS, 'utf-8');
  return JSON.parse(data);
}

// Get template
async function getTemplate(tier, templateType) {
  let filename;
  
  if (templateType === 'resurrection') {
    filename = 'resurrection.html';
  } else if (templateType === 'initial') {
    filename = `tier${tier}-initial.html`;
  } else {
    filename = `${templateType}.html`;
  }
  
  const templatePath = `./templates/${filename}`;
  const template = await fs.readFile(templatePath, 'utf-8');
  return template;
}

// Render template
function renderTemplate(template, data) {
  let rendered = template;
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'object' && value !== null) {
      for (const [nestedKey, nestedValue] of Object.entries(value)) {
        const placeholder = new RegExp(`{{${key}\\.${nestedKey}}}`, 'g');
        rendered = rendered.replace(placeholder, nestedValue || '');
      }
    } else {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      rendered = rendered.replace(placeholder, value || '');
    }
  }
  
  const unsubscribeUrl = `https://neiveralvarez.dev/unsubscribe?email=${encodeURIComponent(data.email || '')}`;
  rendered = rendered.replace(/{{unsubscribeUrl}}/g, unsubscribeUrl);
  
  return rendered;
}

// Send test email
async function sendTestEmail(lead, tier, templateType) {
  const personalizedData = personalizeLead(lead, templateType);
  const template = await getTemplate(tier, templateType);
  const htmlContent = renderTemplate(template, { ...personalizedData, email: lead.email });
  
  try {
    const result = await resend.emails.send({
      from: `Neiver Alvarez <info@neiveralvarez.site>`,
      to: 'convoycubano@gmail.com',
      subject: `[TEST - Tier ${tier}] ${personalizedData.subject}`,
      html: htmlContent,
      replyTo: 'info@neiveralvarez.site'
    });
    
    console.log(`✅ Sent Tier ${tier} test email`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to send Tier ${tier}:`, error.message);
  }
}

// Main function
async function main() {
  console.log('📧 Sending test emails to convoycubano@gmail.com...\n');
  
  const leadsData = await loadLeads();
  const leads = leadsData.leads;
  
  // Get one lead from each tier
  const tier1Lead = leads.find(l => l.tier === 1);
  const tier2Lead = leads.find(l => l.tier === 2);
  const tier3Lead = leads.find(l => l.tier === 3);
  
  console.log('📬 Leads selected for testing:');
  if (tier1Lead) console.log(`   Tier 1: ${tier1Lead.name} (${tier1Lead.job_title})`);
  if (tier2Lead) console.log(`   Tier 2: ${tier2Lead.name} (${tier2Lead.job_title})`);
  if (tier3Lead) console.log(`   Tier 3: ${tier3Lead.name} (${tier3Lead.job_title})`);
  console.log('');
  
  // Send test emails
  if (tier1Lead) {
    console.log('📧 Sending Tier 1 (High Value) email...');
    await sendTestEmail(tier1Lead, 1, 'initial');
    await new Promise(r => setTimeout(r, 2000));
  }
  
  if (tier2Lead) {
    console.log('📧 Sending Tier 2 (Medium Value) email...');
    await sendTestEmail(tier2Lead, 2, 'initial');
    await new Promise(r => setTimeout(r, 2000));
  }
  
  if (tier3Lead) {
    console.log('📧 Sending Tier 3 (Volume) email...');
    await sendTestEmail(tier3Lead, 3, 'initial');
    await new Promise(r => setTimeout(r, 2000));
  }
  
  // Send follow-up samples
  console.log('\n📧 Sending follow-up sequence samples...');
  
  if (tier1Lead) {
    console.log('📧 Sending Follow-up 1 sample...');
    await sendTestEmail(tier1Lead, 1, 'follow-up-1');
    await new Promise(r => setTimeout(r, 2000));
  }
  
  if (tier1Lead) {
    console.log('📧 Sending Follow-up 2 sample...');
    await sendTestEmail(tier1Lead, 1, 'follow-up-2');
    await new Promise(r => setTimeout(r, 2000));
  }
  
  if (tier1Lead) {
    console.log('📧 Sending Breakup email sample...');
    await sendTestEmail(tier1Lead, 1, 'breakup');
    await new Promise(r => setTimeout(r, 2000));
  }
  
  // Send resurrection sample
  if (tier1Lead) {
    console.log('\n📧 Sending Resurrection email sample...');
    const resurrectionLead = { ...tier1Lead, resurrection_count: 1 };
    await sendTestEmail(resurrectionLead, 1, 'resurrection');
  }
  
  console.log('\n✅ All test emails sent to convoycubano@gmail.com!');
  console.log('📬 Check your inbox in a few seconds.\n');
  console.log('📊 You will receive:');
  console.log('   - 3 Initial contact emails (Tier 1, 2, 3)');
  console.log('   - 1 Follow-up 1 email');
  console.log('   - 1 Follow-up 2 email');
  console.log('   - 1 Breakup email');
  console.log('   - 1 Resurrection email');
  console.log('\n   Total: 7 test emails');
}

main().catch(console.error);
