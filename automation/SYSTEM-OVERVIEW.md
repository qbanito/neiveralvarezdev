# 🧠 Email Automation System v2.0

## Sistema Completo de Emails Inteligentes

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         📊 DATA SOURCES                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   APIFY                    WEBSITE SCRAPING              MEMORY         │
│   ┌─────────┐             ┌─────────────────┐          ┌──────────┐    │
│   │ Leads   │             │ Company Site    │          │ Previous │    │
│   │ Dataset │             │ Analysis        │          │ Emails   │    │
│   └────┬────┘             └────────┬────────┘          └────┬─────┘    │
│        │                           │                         │         │
│        ▼                           ▼                         ▼         │
│   ┌─────────────────────────────────────────────────────────────┐     │
│   │                   🔬 LEAD ENRICHER                          │     │
│   │  • Extrae info de la empresa                                │     │
│   │  • Detecta problemas específicos                            │     │
│   │  • Identifica "hooks" de personalización                    │     │
│   │  • Recomienda servicios relevantes                          │     │
│   │  • Determina variante A/B/C para primer email               │     │
│   └─────────────────────────────────────────────────────────────┘     │
│                                    │                                   │
└────────────────────────────────────┼───────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         🧠 INTELLIGENCE LAYER                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────────────────┐     ┌─────────────────────────────────────┐  │
│   │ CONVERSATION MEMORY │     │      ADAPTIVE SEQUENCE              │  │
│   │                     │     │                                     │  │
│   │ • Track opens       │     │  ┌─────┐                            │  │
│   │ • Track clicks      │────▶│  │Email│──▶ Open? ──▶ Click?        │  │
│   │ • Track replies     │     │  │  1  │      │         │           │  │
│   │ • Engagement level  │     │  └──┬──┘      ▼         ▼           │  │
│   │   (hot/warm/cold)   │     │     │     Curious    Interested     │  │
│   │ • Pattern detection │     │     │        │           │          │  │
│   │   (ghost/opener/    │     │     ▼        ▼           ▼          │  │
│   │    engaged)         │     │  Different  Send      Send Demo     │  │
│   │                     │     │  Subject    Question   Faster       │  │
│   └─────────────────────┘     │                                     │  │
│                               └─────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         ✍️ EMAIL GENERATION                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────┐      │
│   │                 🤖 OpenAI GPT-4 Personalizer                │      │
│   │                                                             │      │
│   │  INPUTS:                    OUTPUTS:                        │      │
│   │  • Lead data (name, role)   • Unique subject line           │      │
│   │  • Enriched company info    • Personalized body             │      │
│   │  • Detected problems        • Natural human tone            │      │
│   │  • Previous email context   • References past conversations │      │
│   │  • Behavior pattern         • Adapts angle based on pattern │      │
│   │  • Recommended variant      • A/B/C testing built-in        │      │
│   │                                                             │      │
│   └─────────────────────────────────────────────────────────────┘      │
│                                                                         │
│   6 EMAIL TYPES:                                                        │
│   ┌───────────┬───────────┬───────────┬───────────┬───────────┬────────┐
│   │ Detective │ Resource  │   Demo    │   Case    │ Question  │ Friend │
│   │ (Day 0)   │ (Day 3)   │ (Day 7)   │ (Day 11)  │ (Day 15)  │(Day 21)│
│   │           │           │           │           │           │        │
│   │ "I notice │ "Free     │ "Quick    │ "Similar  │ "Simple   │ "Last  │
│   │  problem" │  resource"│  demo"    │  case"    │  question"│  email"│
│   └───────────┴───────────┴───────────┴───────────┴───────────┴────────┘
│                                                                         │
│   FIRST EMAIL VARIANTS (A/B/C Testing):                                 │
│   • Variant A: Problem-Focused (for tech roles)                         │
│   • Variant B: Curiosity (for executives)                               │
│   • Variant C: Value-First (for marketing/sales)                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         📤 SENDING & TRACKING                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌──────────┐         ┌──────────────┐         ┌───────────────────┐  │
│   │  RESEND  │────────▶│   WEBHOOKS   │────────▶│  UPDATE MEMORY    │  │
│   │   API    │         │              │         │                   │  │
│   └──────────┘         │ • delivered  │         │ • Mark opens      │  │
│                        │ • opened     │         │ • Track clicks    │  │
│   Features:            │ • clicked    │         │ • Log replies     │  │
│   • Rate limiting      │ • bounced    │         │ • Adjust sequence │  │
│   • BCC to Gmail       │ • complained │         │ • Stop if replied │  │
│   • Reply forwarding   │              │         │                   │  │
│                        └──────────────┘         └───────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘


## 📁 File Structure

```
automation/
├── sender.js                 # 📧 Main sender (orchestrates everything)
├── openai-personalizer.js    # 🤖 AI email generation with GPT-4
├── lead-enricher.js          # 🔬 Deep company analysis
├── lead-researcher.js        # 🔍 Lead research from Apify data
├── conversation-memory.js    # 🧠 Track email history & behavior
├── adaptive-sequence.js      # 🔀 Dynamic sequence logic
├── config.js                 # ⚙️ Configuration & settings
├── apify-fetcher.js          # 📥 Fetch leads from Apify
└── email-personalizer.js     # 📝 Basic personalization (fallback)
```


## 🔄 Flow for Each Email

```
1. Get lead from queue
        ↓
2. Enrich with lead-enricher.js
   • Scrape company website
   • Detect problems
   • Find personalization hooks
   • Recommend A/B/C variant
        ↓
3. Check conversation-memory.js
   • How many emails sent?
   • Any opens/clicks?
   • What pattern? (ghost/opener/engaged)
        ↓
4. Get next action from adaptive-sequence.js
   • Send? Skip? Stop?
   • Which email type?
   • Which variant?
        ↓
5. Generate email with openai-personalizer.js
   • Pass all enriched data
   • Include conversation context
   • Get unique subject + body
        ↓
6. Send via Resend
   • Track with headers
   • BCC for review
        ↓
7. Log to conversation-memory.js
   • Store what was sent
   • Ready for next decision
```


## 📊 Personalization Levels

| Level | Data Used | Example |
|-------|-----------|---------|
| **Basic** | Name, Company | "Hey John, I see you work at Acme..." |
| **Industry** | Industry, Role | "As a Marketing Director in SaaS..." |
| **Company-Specific** | Website analysis | "I noticed your checkout flow has 5 steps..." |
| **Problem-Aware** | Detected issues | "That testimonials section could be getting 3x more conversions..." |
| **Context-Aware** | Previous emails | "I know I mentioned the demo last week..." |
| **Behavior-Adaptive** | Opens/clicks | Different approach if ghosting vs engaging |


## 🎯 Adaptive Behaviors

| Lead Pattern | Detection | Sequence Adjustment |
|--------------|-----------|---------------------|
| **Ghost** | No opens | Try different subject lines, then breakup |
| **Opener** | Opens but no clicks | Ask direct questions |
| **Engaged** | Clicks links | Fast-track to demo |
| **Hot** | Replies | STOP sequence, manual follow-up |


## 🔑 API Keys Required

```env
RESEND_API_KEY=re_xxxxx           # For sending emails
OPENAI_API_KEY=sk-proj-xxxxx      # For AI generation
APIFY_API_TOKEN=apify_api_xxxxx   # For fetching leads
```


## 🚀 Running

```bash
# Test single email
node automation/test-ai-email.js

# Run full campaign
node automation/sender.js

# With force send (bypass time restrictions)
FORCE_SEND=true node automation/sender.js
```


## 📈 GitHub Actions Schedule

- **Monday - Friday**
- **3x daily**: 9:00 AM, 1:00 PM, 5:00 PM UTC
- Automatically fetches new leads and sends personalized emails
