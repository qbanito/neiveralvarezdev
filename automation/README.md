# 🚀 Intelligent Email Outreach Automation

Complete cold email automation system with GitHub Actions integration.

## 📋 Features

- ✅ **Apify Integration** - Auto-fetch leads from dataset
- ✅ **Smart Rate Limiting** - Domain protection (10-50 emails/day)
- ✅ **3-Tier Personalization** - Executive, Manager, Volume templates
- ✅ **Lead Resurrection** - Automatically revive old leads when queue is low
- ✅ **Auto-forwarding** - Replies go to convoycubano@gmail.com
- ✅ **Sequence Management** - Initial → Follow-up 1 → Follow-up 2 → Breakup
- ✅ **Analytics Dashboard** - Weekly performance reports
- ✅ **GitHub Actions** - Fully automated via workflows

## 🏗️ Architecture

```
automation/
├── config.js              # Main configuration
├── apify-fetcher.js       # Fetch leads from Apify
├── email-personalizer.js  # AI-powered personalization
├── sender.js              # Smart email sending
├── response-handler.js    # Handle replies & forwards
├── analytics.js           # Generate reports
└── templates/             # Email templates (tier 1-3)

data/
├── leads.json             # Lead database
├── sent.json              # Sent emails log
├── analytics.json         # Performance metrics
└── unsubscribed.json      # Unsubscribed list

.github/workflows/
├── fetch-leads.yml        # Daily at 6 AM
├── send-campaigns.yml     # 3x daily (9AM, 1PM, 5PM)
└── analytics.yml          # Weekly on Mondays
```

## 🔧 Setup

### 1. GitHub Secrets

Add these secrets to your repository:

```
Settings → Secrets and variables → Actions → New repository secret
```

- `APIFY_API_KEY` = Your Apify API key
- `RESEND_API_KEY` = Your Resend API key

### 2. Enable GitHub Actions

```
Settings → Actions → General → Allow all actions
```

### 3. Update Configuration

Edit `automation/config.js`:

```javascript
FROM_EMAIL: 'your-email@yourdomain.com',
FORWARD_TO: 'convoycubano@gmail.com',
START_DATE: '2026-01-24', // Today's date
```

### 4. Domain Setup (IMPORTANT)

Configure your domain's DNS records:

**SPF Record:**
```
v=spf1 include:_spf.resend.com ~all
```

**DKIM Record:**
Get from Resend dashboard and add to DNS

**DMARC Record:**
```
v=DMARC1; p=quarantine; rua=mailto:your-email@yourdomain.com
```

## 🚦 Usage

### Manual Testing

```bash
# Fetch leads from Apify
cd automation
npm install
npm run fetch

# Test email sending
npm run send

# Generate analytics report
npm run analytics
```

### Automatic (GitHub Actions)

Once setup, the system runs automatically:

- **6 AM daily**: Fetch new leads + resurrect old ones
- **9 AM, 1 PM, 5 PM** (Mon-Fri): Send campaigns
- **Mondays 8 AM**: Weekly analytics report

### Monitor Runs

```
Actions tab → Select workflow → View logs
```

## 📧 Email Sequences

### Initial Contact (Day 0)
- Personalized hook based on tier
- Relevant project showcase
- Clear CTA

### Follow-up 1 (Day +3)
- Value-add resource
- Case study brief
- Soft CTA

### Follow-up 2 (Day +7)
- Additional project highlight
- Social proof
- Direct question

### Breakup (Day +14)
- Respectful close
- Unsubscribe option
- Future reconnect offer

### Resurrection (90+ days)
- "Checking back in" approach
- New work showcase
- Fresh value proposition

## 🔄 Lead Resurrection System

When pending leads drop below 50:

1. ✅ Scans leads with status: `sent`, `opened`, `no_reply`
2. ✅ Checks if 90+ days since last contact
3. ✅ Reactivates up to 2 times per lead
4. ✅ Uses special "resurrection" template
5. ✅ Automatically adds back to queue

**Example Output:**
```
🧟 Checking if lead resurrection is needed...
📊 Current pending leads: 25
🔄 Low on leads! Starting resurrection process...
🧟 Resurrected: john@company.com (attempt 1)
🧟 Resurrected: jane@startup.io (attempt 1)
✨ Successfully resurrected 2 leads
```

## 📊 Rate Limiting (Domain Protection)

Progressive warm-up schedule:

| Phase | Days | Emails/Day | Status |
|-------|------|------------|--------|
| Warm-up | 1-3 | 10 | 🟡 Starting |
| Initial Ramp | 4-7 | 20 | 🟢 Growing |
| Mid Ramp | 8-14 | 30 | 🟢 Scaling |
| Full Capacity | 15+ | 50 | 🚀 Max |

**Safety Checks:**
- ⛔ Stop if bounce rate > 5%
- ⛔ Stop if spam rate > 1%
- ✅ Only Mon-Fri, 9am-5pm
- ✅ Never exceed daily limit

## 🎯 Lead Scoring

### Tier 1 (High Value)
- CEOs, CTOs, Founders
- Startups/SaaS companies
- 100% personalized templates
- Priority sending

### Tier 2 (Medium Value)
- Directors, Managers
- Tech companies
- 70% personalized templates
- Standard priority

### Tier 3 (Volume)
- General professionals
- All industries
- 40% personalized templates
- Low priority

## 📮 Reply Handling

When a lead replies:

1. ✅ Stop sequence immediately
2. ✅ Update status to "replied"
3. ✅ Forward to `convoycubano@gmail.com`
4. ✅ Include lead info + LinkedIn
5. ✅ Track in analytics

**Forward Email Includes:**
- Lead name, company, title
- LinkedIn profile link
- Original reply content
- One-click reply button

## 📈 Analytics

Weekly report includes:

- **Overview**: Total leads, pending, sent, replies
- **Performance**: Open, click, reply, bounce rates
- **Tier Breakdown**: Success rate by tier
- **Resurrection Stats**: Effectiveness of revival
- **Last 7 Days**: Recent activity trends

**Targets:**
- Open Rate: >40%
- Click Rate: >10%
- Reply Rate: >5%
- Bounce Rate: <2%

## 🛡️ Safety Features

- ✅ Email validation before sending
- ✅ Automatic deduplication
- ✅ Unsubscribe link in every email
- ✅ Bounce/spam monitoring
- ✅ Immediate unsubscribe processing
- ✅ CAN-SPAM compliance
- ✅ GDPR ready

## 🔍 Troubleshooting

### Workflows not running

```bash
# Check if Actions are enabled
Settings → Actions → Workflow permissions → Read and write

# Manually trigger workflow
Actions → Select workflow → Run workflow
```

### No leads being fetched

```bash
# Test Apify connection
cd automation
node apify-fetcher.js

# Check API key in secrets
Settings → Secrets → APIFY_API_KEY
```

### Emails not sending

```bash
# Test Resend connection
cd automation
node sender.js

# Verify domain DNS records in Resend dashboard
```

### High bounce rate

- Check email validation
- Verify Apify data quality
- Reduce sending volume
- Review templates for spam triggers

## 📝 Customization

### Add new template

1. Create `automation/templates/your-template.html`
2. Add variables: `{{name}}`, `{{company}}`, etc.
3. Update `email-personalizer.js` with logic
4. Add to sequence in `config.js`

### Change sending schedule

Edit `.github/workflows/send-campaigns.yml`:

```yaml
schedule:
  - cron: '0 10 * * 1-5'  # 10 AM Mon-Fri
```

### Adjust rate limits

Edit `automation/config.js`:

```javascript
RATE_LIMITS: {
  DAY_1_3: 15,    // Increase from 10
  DAY_15_PLUS: 75 // Increase from 50
}
```

### Modify resurrection rules

Edit `automation/config.js`:

```javascript
RESURRECTION: {
  COOL_DOWN_DAYS: 60,        // Wait 60 days (was 90)
  MAX_RESURRECTIONS: 3,       // Try 3 times (was 2)
  MIN_LEADS_THRESHOLD: 30     // Trigger at 30 (was 50)
}
```

## 🚀 Best Practices

1. **Start slow**: Don't change warm-up schedule
2. **Monitor metrics**: Check bounce/spam rates daily
3. **Test templates**: Send to yourself first
4. **Personalize tier 1**: Manually review high-value leads
5. **Respond fast**: Reply to leads within 2 hours
6. **Clean data**: Remove bounced emails regularly
7. **Update portfolio**: Keep projects current in config
8. **A/B test**: Try different subject lines

## 📞 Support

If you need help:

1. Check GitHub Actions logs
2. Review `data/` files for errors
3. Test scripts manually with `npm run [command]`
4. Verify API keys in secrets

## 🎉 Success Metrics

**Month 1 Target:**
- 500 emails sent
- 40% open rate
- 5% reply rate
- 2-3 contracts

**Month 3 Target:**
- 1500 emails sent
- 45% open rate
- 7% reply rate
- 5-7 contracts

---

**System Status:** ✅ Ready to Deploy

**Last Updated:** January 24, 2026

**Version:** 1.0.0
