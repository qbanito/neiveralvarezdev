// 🔍 APIFY LEAD FETCHER
// Fetches leads from Apify dataset and processes them

import { ApifyClient } from 'apify-client';
import fs from 'fs/promises';
import path from 'path';
import { CONFIG, calculateLeadTier } from './config.js';

const client = new ApifyClient({
  token: CONFIG.APIFY_API_KEY,
});

// Fetch leads from Apify dataset
export async function fetchLeadsFromApify() {
  try {
    console.log('🔍 Fetching leads from Apify dataset...');
    
    const dataset = client.dataset(CONFIG.APIFY_DATASET_ID);
    const { items } = await dataset.listItems();
    
    console.log(`✅ Found ${items.length} leads in dataset`);
    return items;
  } catch (error) {
    console.error('❌ Error fetching from Apify:', error.message);
    return [];
  }
}

// Load existing leads from local database
export async function loadExistingLeads() {
  try {
    const data = await fs.readFile(CONFIG.DATA_FILES.LEADS, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.log('📝 No existing leads file, creating new one');
    return { leads: [], lastUpdated: new Date().toISOString() };
  }
}

// Load unsubscribed emails
export async function loadUnsubscribed() {
  try {
    const data = await fs.readFile(CONFIG.DATA_FILES.UNSUBSCRIBED, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return { emails: [] };
  }
}

// Process and deduplicate leads
export async function processLeads(rawLeads) {
  const existingData = await loadExistingLeads();
  const unsubscribed = await loadUnsubscribed();
  
  const existingEmails = new Set(existingData.leads.map(l => l.email.toLowerCase()));
  const unsubscribedEmails = new Set(unsubscribed.emails.map(e => e.toLowerCase()));
  
  const newLeads = [];
  
  for (const lead of rawLeads) {
    // Skip if no email or invalid
    if (!lead.email || !isValidEmail(lead.email)) {
      console.log(`⚠️  Skipping invalid email: ${lead.email}`);
      continue;
    }
    
    const emailLower = lead.email.toLowerCase();
    
    // Skip if already exists or unsubscribed
    if (existingEmails.has(emailLower) || unsubscribedEmails.has(emailLower)) {
      continue;
    }
    
    // Calculate tier
    const tier = calculateLeadTier(lead.job_title || '', lead.industry || '');
    
    // Create structured lead
    const processedLead = {
      id: generateLeadId(),
      email: lead.email,
      name: lead.name || extractNameFromEmail(lead.email),
      company: lead.company || 'Unknown',
      job_title: lead.job_title || 'Professional',
      linkedin_url: lead.linkedin_url || '',
      company_website: lead.company_website || '',
      industry: lead.industry || 'Technology',
      tier: tier,
      status: 'pending',
      sequence_step: 0,
      last_contact: null,
      next_contact: new Date().toISOString().split('T')[0],
      tags: extractTags(lead),
      custom_notes: '',
      added_date: new Date().toISOString(),
      resurrection_count: 0
    };
    
    newLeads.push(processedLead);
    existingEmails.add(emailLower);
  }
  
  console.log(`✨ Processed ${newLeads.length} new unique leads`);
  return newLeads;
}

// Save leads to database
export async function saveLeads(newLeads) {
  const existingData = await loadExistingLeads();
  
  existingData.leads = [...existingData.leads, ...newLeads];
  existingData.lastUpdated = new Date().toISOString();
  existingData.totalLeads = existingData.leads.length;
  
  await fs.writeFile(
    CONFIG.DATA_FILES.LEADS,
    JSON.stringify(existingData, null, 2)
  );
  
  console.log(`💾 Saved ${newLeads.length} new leads. Total: ${existingData.totalLeads}`);
}

// 🔄 RESURRECTION SYSTEM
export async function resurrectLeads() {
  console.log('🧟 Checking if lead resurrection is needed...');
  
  const existingData = await loadExistingLeads();
  const pendingLeads = existingData.leads.filter(l => l.status === 'pending');
  
  console.log(`📊 Current pending leads: ${pendingLeads.length}`);
  
  // Check if we need resurrection
  if (pendingLeads.length >= CONFIG.RESURRECTION.MIN_LEADS_THRESHOLD) {
    console.log('✅ Sufficient leads available, no resurrection needed');
    return 0;
  }
  
  console.log(`🔄 Low on leads! Starting resurrection process...`);
  
  const now = new Date();
  const coolDownMs = CONFIG.RESURRECTION.COOL_DOWN_DAYS * 24 * 60 * 60 * 1000;
  
  let resurrectedCount = 0;
  
  for (const lead of existingData.leads) {
    // Skip if already pending or reached max resurrections
    if (lead.status === 'pending' || 
        lead.resurrection_count >= CONFIG.RESURRECTION.MAX_RESURRECTIONS) {
      continue;
    }
    
    // Skip if not eligible status
    if (!['sent', 'opened', 'no_reply'].includes(lead.status)) {
      continue;
    }
    
    // Check if cool down period has passed
    if (lead.last_contact) {
      const lastContactDate = new Date(lead.last_contact);
      const daysSinceContact = (now - lastContactDate) / (1000 * 60 * 60 * 24);
      
      if (daysSinceContact >= CONFIG.RESURRECTION.COOL_DOWN_DAYS) {
        // Resurrect this lead
        lead.status = 'pending';
        lead.sequence_step = 0;
        lead.next_contact = new Date().toISOString().split('T')[0];
        lead.resurrection_count = (lead.resurrection_count || 0) + 1;
        lead.resurrected_date = new Date().toISOString();
        
        resurrectedCount++;
        console.log(`🧟 Resurrected: ${lead.email} (attempt ${lead.resurrection_count})`);
        
        // Stop if we have enough leads
        if (pendingLeads.length + resurrectedCount >= CONFIG.RESURRECTION.MIN_LEADS_THRESHOLD) {
          break;
        }
      }
    }
  }
  
  if (resurrectedCount > 0) {
    existingData.lastUpdated = new Date().toISOString();
    await fs.writeFile(
      CONFIG.DATA_FILES.LEADS,
      JSON.stringify(existingData, null, 2)
    );
    
    console.log(`✨ Successfully resurrected ${resurrectedCount} leads`);
  } else {
    console.log('⚠️  No leads eligible for resurrection');
  }
  
  return resurrectedCount;
}

// Utility functions
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function generateLeadId() {
  return `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function extractNameFromEmail(email) {
  const username = email.split('@')[0];
  return username
    .split(/[._-]/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function extractTags(lead) {
  const tags = [];
  
  if (lead.company_size && lead.company_size < 50) tags.push('startup');
  if (lead.industry) tags.push(lead.industry.toLowerCase());
  if (lead.tech_stack) {
    lead.tech_stack.split(',').forEach(tech => tags.push(tech.trim().toLowerCase()));
  }
  if (lead.job_title && lead.job_title.toLowerCase().includes('founder')) {
    tags.push('founder');
  }
  
  return tags;
}

// Main execution
export async function main() {
  try {
    console.log('🚀 Starting lead fetcher...\n');
    
    // First, check if resurrection is needed
    const resurrectedCount = await resurrectLeads();
    
    // Then fetch new leads from Apify
    const rawLeads = await fetchLeadsFromApify();
    
    if (rawLeads.length === 0) {
      console.log('⚠️  No new leads from Apify');
      if (resurrectedCount === 0) {
        console.log('❌ No new leads and no resurrections - manual review needed');
      }
      return;
    }
    
    const processedLeads = await processLeads(rawLeads);
    
    if (processedLeads.length > 0) {
      await saveLeads(processedLeads);
      console.log(`\n✅ Successfully added ${processedLeads.length} new leads`);
    } else {
      console.log('\n⚠️  No new unique leads to add');
    }
    
    // Summary
    const finalData = await loadExistingLeads();
    const pendingCount = finalData.leads.filter(l => l.status === 'pending').length;
    console.log(`\n📊 SUMMARY:`);
    console.log(`   Total leads: ${finalData.totalLeads}`);
    console.log(`   Pending: ${pendingCount}`);
    console.log(`   Resurrected today: ${resurrectedCount}`);
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run if called directly
main();
