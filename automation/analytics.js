// 📊 ANALYTICS & REPORTING
// Generates weekly reports and tracks campaign performance

import { Resend } from 'resend';
import fs from 'fs/promises';
import { CONFIG } from './config.js';

const resend = new Resend(CONFIG.RESEND_API_KEY);

async function loadData(file) {
  try {
    const data = await fs.readFile(file, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

// Generate analytics report
export async function generateReport() {
  console.log('📊 Generating analytics report...\n');
  
  const leadsData = await loadData(CONFIG.DATA_FILES.LEADS);
  const sentData = await loadData(CONFIG.DATA_FILES.SENT);
  const analytics = await loadData(CONFIG.DATA_FILES.ANALYTICS);
  
  const leads = leadsData.leads || [];
  const sent = sentData.sent || [];
  
  // Calculate metrics
  const totalLeads = leads.length;
  const pendingLeads = leads.filter(l => l.status === 'pending').length;
  const sentCount = sent.length;
  const openedCount = leads.filter(l => l.status === 'opened' || l.status === 'clicked' || l.status === 'replied').length;
  const clickedCount = leads.filter(l => l.status === 'clicked' || l.status === 'replied').length;
  const repliedCount = leads.filter(l => l.status === 'replied').length;
  const bouncedCount = leads.filter(l => l.status === 'bounced').length;
  const unsubscribedCount = leads.filter(l => l.status === 'unsubscribed').length;
  
  // Calculate rates
  const openRate = sentCount > 0 ? ((openedCount / sentCount) * 100).toFixed(2) : 0;
  const clickRate = sentCount > 0 ? ((clickedCount / sentCount) * 100).toFixed(2) : 0;
  const replyRate = sentCount > 0 ? ((repliedCount / sentCount) * 100).toFixed(2) : 0;
  const bounceRate = sentCount > 0 ? ((bouncedCount / sentCount) * 100).toFixed(2) : 0;
  
  // Tier breakdown
  const tier1Leads = leads.filter(l => l.tier === 1).length;
  const tier2Leads = leads.filter(l => l.tier === 2).length;
  const tier3Leads = leads.filter(l => l.tier === 3).length;
  
  const tier1Replies = leads.filter(l => l.tier === 1 && l.status === 'replied').length;
  const tier2Replies = leads.filter(l => l.tier === 2 && l.status === 'replied').length;
  const tier3Replies = leads.filter(l => l.tier === 3 && l.status === 'replied').length;
  
  // Resurrection stats
  const resurrectedLeads = leads.filter(l => l.resurrection_count > 0).length;
  const resurrectedReplies = leads.filter(l => l.resurrection_count > 0 && l.status === 'replied').length;
  
  // Last 7 days activity
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentSent = sent.filter(s => new Date(s.sentAt) >= sevenDaysAgo).length;
  const recentReplies = leads.filter(l => 
    l.replied_at && new Date(l.replied_at) >= sevenDaysAgo
  ).length;
  
  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalLeads,
      pendingLeads,
      sentCount,
      openedCount,
      clickedCount,
      repliedCount,
      bouncedCount,
      unsubscribedCount
    },
    rates: {
      openRate: `${openRate}%`,
      clickRate: `${clickRate}%`,
      replyRate: `${replyRate}%`,
      bounceRate: `${bounceRate}%`
    },
    tierBreakdown: {
      tier1: { total: tier1Leads, replies: tier1Replies, rate: tier1Leads > 0 ? `${((tier1Replies / tier1Leads) * 100).toFixed(2)}%` : '0%' },
      tier2: { total: tier2Leads, replies: tier2Replies, rate: tier2Leads > 0 ? `${((tier2Replies / tier2Leads) * 100).toFixed(2)}%` : '0%' },
      tier3: { total: tier3Leads, replies: tier3Replies, rate: tier3Leads > 0 ? `${((tier3Replies / tier3Leads) * 100).toFixed(2)}%` : '0%' }
    },
    resurrection: {
      total: resurrectedLeads,
      replies: resurrectedReplies,
      successRate: resurrectedLeads > 0 ? `${((resurrectedReplies / resurrectedLeads) * 100).toFixed(2)}%` : '0%'
    },
    last7Days: {
      sent: recentSent,
      replies: recentReplies,
      dailyAverage: (recentSent / 7).toFixed(1)
    }
  };
  
  return report;
}

// Send report via email
export async function sendReport(report) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb; padding: 20px; }
    .container { max-width: 700px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
    .content { padding: 30px; }
    .metric-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
    .metric-card { background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; }
    .metric-card.success { background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-left-color: #10b981; }
    .metric-card.warning { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left-color: #f59e0b; }
    .metric-card.danger { background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border-left-color: #ef4444; }
    .metric-label { font-size: 13px; color: #6b7280; text-transform: uppercase; font-weight: 600; margin-bottom: 5px; }
    .metric-value { font-size: 32px; font-weight: 700; color: #1f2937; }
    .tier-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .tier-table th { background: #f3f4f6; padding: 12px; text-align: left; font-weight: 600; color: #374151; }
    .tier-table td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
    h2 { color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0 0 10px 0; font-size: 28px;">📊 Weekly Campaign Report</h1>
      <p style="margin: 0; opacity: 0.9;">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>
    
    <div class="content">
      <h2>📈 Overview</h2>
      <div class="metric-grid">
        <div class="metric-card">
          <div class="metric-label">Total Leads</div>
          <div class="metric-value">${report.summary.totalLeads}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Pending</div>
          <div class="metric-value">${report.summary.pendingLeads}</div>
        </div>
        <div class="metric-card success">
          <div class="metric-label">Emails Sent</div>
          <div class="metric-value">${report.summary.sentCount}</div>
        </div>
        <div class="metric-card success">
          <div class="metric-label">Replies</div>
          <div class="metric-value">${report.summary.repliedCount}</div>
        </div>
      </div>
      
      <h2>🎯 Performance Metrics</h2>
      <div class="metric-grid">
        <div class="metric-card ${parseFloat(report.rates.openRate) >= 40 ? 'success' : parseFloat(report.rates.openRate) >= 25 ? 'warning' : 'danger'}">
          <div class="metric-label">Open Rate</div>
          <div class="metric-value">${report.rates.openRate}</div>
          <div style="font-size: 12px; color: #6b7280; margin-top: 5px;">Target: >40%</div>
        </div>
        <div class="metric-card ${parseFloat(report.rates.clickRate) >= 10 ? 'success' : parseFloat(report.rates.clickRate) >= 5 ? 'warning' : 'danger'}">
          <div class="metric-label">Click Rate</div>
          <div class="metric-value">${report.rates.clickRate}</div>
          <div style="font-size: 12px; color: #6b7280; margin-top: 5px;">Target: >10%</div>
        </div>
        <div class="metric-card ${parseFloat(report.rates.replyRate) >= 5 ? 'success' : parseFloat(report.rates.replyRate) >= 3 ? 'warning' : 'danger'}">
          <div class="metric-label">Reply Rate</div>
          <div class="metric-value">${report.rates.replyRate}</div>
          <div style="font-size: 12px; color: #6b7280; margin-top: 5px;">Target: >5%</div>
        </div>
        <div class="metric-card ${parseFloat(report.rates.bounceRate) <= 2 ? 'success' : parseFloat(report.rates.bounceRate) <= 5 ? 'warning' : 'danger'}">
          <div class="metric-label">Bounce Rate</div>
          <div class="metric-value">${report.rates.bounceRate}</div>
          <div style="font-size: 12px; color: #6b7280; margin-top: 5px;">Target: <2%</div>
        </div>
      </div>
      
      <h2>🎖️ Tier Performance</h2>
      <table class="tier-table">
        <thead>
          <tr>
            <th>Tier</th>
            <th>Total Leads</th>
            <th>Replies</th>
            <th>Success Rate</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Tier 1</strong> (High Value)</td>
            <td>${report.tierBreakdown.tier1.total}</td>
            <td>${report.tierBreakdown.tier1.replies}</td>
            <td><strong>${report.tierBreakdown.tier1.rate}</strong></td>
          </tr>
          <tr>
            <td><strong>Tier 2</strong> (Medium Value)</td>
            <td>${report.tierBreakdown.tier2.total}</td>
            <td>${report.tierBreakdown.tier2.replies}</td>
            <td><strong>${report.tierBreakdown.tier2.rate}</strong></td>
          </tr>
          <tr>
            <td><strong>Tier 3</strong> (Volume)</td>
            <td>${report.tierBreakdown.tier3.total}</td>
            <td>${report.tierBreakdown.tier3.replies}</td>
            <td><strong>${report.tierBreakdown.tier3.rate}</strong></td>
          </tr>
        </tbody>
      </table>
      
      <h2>🧟 Resurrection Performance</h2>
      <div class="metric-grid">
        <div class="metric-card">
          <div class="metric-label">Resurrected Leads</div>
          <div class="metric-value">${report.resurrection.total}</div>
        </div>
        <div class="metric-card ${parseFloat(report.resurrection.successRate) >= 3 ? 'success' : 'warning'}">
          <div class="metric-label">Resurrection Success</div>
          <div class="metric-value">${report.resurrection.successRate}</div>
          <div style="font-size: 12px; color: #6b7280; margin-top: 5px;">${report.resurrection.replies} replies</div>
        </div>
      </div>
      
      <h2>📅 Last 7 Days Activity</h2>
      <div class="metric-grid">
        <div class="metric-card">
          <div class="metric-label">Emails Sent</div>
          <div class="metric-value">${report.last7Days.sent}</div>
          <div style="font-size: 12px; color: #6b7280; margin-top: 5px;">${report.last7Days.dailyAverage}/day avg</div>
        </div>
        <div class="metric-card success">
          <div class="metric-label">New Replies</div>
          <div class="metric-value">${report.last7Days.replies}</div>
        </div>
      </div>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      
      <p style="text-align: center; color: #6b7280; font-size: 14px;">
        Generated automatically by your outreach automation system
      </p>
    </div>
  </div>
</body>
</html>
  `;
  
  try {
    await resend.emails.send({
      from: `Analytics <${CONFIG.FROM_EMAIL}>`,
      to: CONFIG.FORWARD_TO,
      subject: `📊 Weekly Campaign Report - ${new Date().toLocaleDateString()}`,
      html: html
    });
    
    console.log('✅ Report sent successfully!');
  } catch (error) {
    console.error('❌ Failed to send report:', error.message);
  }
}

// Main function
export async function main() {
  const report = await generateReport();
  console.log('\n📊 ANALYTICS REPORT:');
  console.log(JSON.stringify(report, null, 2));
  
  await sendReport(report);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default { generateReport, sendReport };
