# ⚡ QUICK START GUIDE - Email Outreach Automation

## 🚀 IMMEDIATE SETUP (5 Minutes)

### Step 1: Add GitHub Secrets

Go to: https://github.com/qbanito/neiveralvarezdev/settings/secrets/actions

Click **"New repository secret"** and add these TWO secrets:

```
Name: APIFY_API_KEY
Value: [Your Apify API key from the project]

Name: RESEND_API_KEY
Value: [Your Resend API key]
```

> **Note:** API keys are stored in your local environment or password manager for security.

### Step 2: Enable GitHub Actions

Go to: https://github.com/qbanito/neiveralvarezdev/settings/actions

- ✅ Check "Allow all actions and reusable workflows"
- ✅ Check "Read and write permissions"
- Click **Save**

### Step 3: Test Manually (Optional)

```bash
cd automation
npm install

# Test lead fetcher
node apify-fetcher.js

# Test email sender (will check schedule first)
node sender.js

# Generate analytics
node analytics.js
```

---

## 📅 AUTOMATIC SCHEDULE

Once setup, GitHub Actions will run automatically:

| Time | Action | Description |
|------|--------|-------------|
| **6 AM daily** | Fetch Leads | Gets new leads from Apify + resurrects old ones |
| **9 AM Mon-Fri** | Send Batch 1 | Morning email batch |
| **1 PM Mon-Fri** | Send Batch 2 | Afternoon email batch |
| **5 PM Mon-Fri** | Send Batch 3 | Evening email batch |
| **Monday 8 AM** | Analytics | Weekly performance report to convoycubano@gmail.com |

---

## 🔄 LEAD RESURRECTION EXPLAINED

When you run out of fresh leads (below 50 pending):

1. **Searches** old leads with status: `sent`, `opened`, `no_reply`
2. **Checks** if 90+ days have passed since last contact
3. **Reactivates** up to 2 times per lead maximum
4. **Sends** special "resurrection" template
5. **Tracks** success rate separately

**Example:**
```
🧟 Low on leads! Starting resurrection...
🧟 Resurrected: john@company.com (attempt 1)
🧟 Resurrected: jane@startup.io (attempt 1)
✨ Successfully resurrected 2 leads
```

---

## 📊 HOW TO MONITOR

### View GitHub Actions Logs

1. Go to: https://github.com/qbanito/neiveralvarezdev/actions
2. Click on any workflow run
3. Click on the job name
4. Expand steps to see logs

### Check Data Files

```bash
# View all leads
cat data/leads.json

# View sent emails log
cat data/sent.json

# View analytics
cat data/analytics.json

# View unsubscribed
cat data/unsubscribed.json
```

---

## 🎯 RATE LIMITING (Protects Your Domain)

| Days | Emails/Day | Status |
|------|------------|--------|
| 1-3 | 10 | 🟡 Warming Up |
| 4-7 | 20 | 🟢 Ramping |
| 8-14 | 30 | 🟢 Scaling |
| 15+ | 50 | 🚀 Full Speed |

**Safety Features:**
- ⛔ Stops if bounce rate > 5%
- ⛔ Stops if spam rate > 1%
- ✅ Only sends Mon-Fri, 9am-5pm
- ✅ Never exceeds daily limit

---

## 📧 WHEN YOU GET A REPLY

The system **automatically**:

1. ✅ Stops the email sequence for that lead
2. ✅ Updates status to "replied"
3. ✅ Forwards email to **convoycubano@gmail.com**
4. ✅ Includes lead info + LinkedIn profile
5. ✅ Tracks in analytics

**You'll receive an email like this:**

```
🎉 New Lead Reply!

Lead Information:
Name: John Doe
Email: john@techcorp.com
Company: TechCorp
Title: CTO
LinkedIn: [link]

Reply: "Hi Neiver, yes I'm interested..."

[Reply Button]
```

---

## 🛡️ SAFETY & COMPLIANCE

✅ Unsubscribe link in every email
✅ CAN-SPAM compliant
✅ GDPR ready
✅ Automatic bounce handling
✅ Spam complaint monitoring
✅ Email validation before sending

---

## 🔧 CUSTOMIZATION (Optional)

### Change Email Sending Times

Edit `.github/workflows/send-campaigns.yml`:

```yaml
schedule:
  - cron: '0 10 * * 1-5'  # 10 AM instead of 9 AM
```

### Adjust Rate Limits

Edit `automation/config.js`:

```javascript
RATE_LIMITS: {
  DAY_1_3: 15,    // More aggressive
  DAY_15_PLUS: 75 // Higher max
}
```

### Modify Resurrection Settings

Edit `automation/config.js`:

```javascript
RESURRECTION: {
  COOL_DOWN_DAYS: 60,     // Wait 60 days (was 90)
  MAX_RESURRECTIONS: 3,    // Try 3 times (was 2)
  MIN_LEADS_THRESHOLD: 30  // Trigger at 30 (was 50)
}
```

---

## 📈 SUCCESS TARGETS

**Month 1:**
- 500 emails sent (10-20/day during warmup)
- 40% open rate
- 5% reply rate
- **Goal: 2-3 contracts**

**Month 3:**
- 1500 emails sent (50/day at full speed)
- 45% open rate
- 7% reply rate
- **Goal: 5-7 contracts**

---

## 🚨 TROUBLESHOOTING

### Workflows Not Running

```
Settings → Actions → Enable workflows
Actions → Select workflow → "Run workflow" button
```

### No Leads Being Fetched

```bash
# Test Apify connection manually
cd automation
node apify-fetcher.js

# Check if API key is correct in GitHub Secrets
```

### Emails Not Sending

1. Check it's Mon-Fri between 9am-5pm
2. Check daily limit not reached
3. Verify Resend API key in GitHub Secrets
4. Check logs in GitHub Actions

### High Bounce Rate

- Pause system if >5%
- Check Apify data quality
- Verify email validation is working
- Review lead sources

---

## ✅ VERIFICATION CHECKLIST

Before going live, confirm:

- [ ] GitHub Secrets added (APIFY_API_KEY, RESEND_API_KEY)
- [ ] GitHub Actions enabled
- [ ] Workflows scheduled correctly
- [ ] Email domain DNS configured (SPF, DKIM, DMARC)
- [ ] Test run completed successfully
- [ ] Forward email (convoycubano@gmail.com) confirmed working
- [ ] START_DATE set to today in config.js

---

## 🎉 YOU'RE READY!

The system will:

1. Automatically fetch leads from Apify daily
2. Send personalized campaigns 3x per day (Mon-Fri)
3. Resurrect old leads when running low
4. Forward all replies to your email
5. Send weekly analytics reports

**Just respond to replies fast and close deals! 🚀**

---

**Need Help?**

1. Check GitHub Actions logs
2. Review automation/README.md for details
3. Test scripts manually with `npm run [command]`

**System Status:** ✅ DEPLOYED

**Version:** 1.0.0

**Last Updated:** January 24, 2026
