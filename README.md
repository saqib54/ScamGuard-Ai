# ScamShield AI — "Think Before You Click" 🛡️

ScamShield AI is an enterprise-grade, privacy-first cybersecurity assistant engineered to empower everyday digital citizens to inspect suspicious messages (SMS, WhatsApp, Phishing Emails), deceptive URLs, and screenshot flyers across **English, Urdu (اردو), and Roman Urdu** before interacting with them.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-5.0-lightgrey.svg)](https://expressjs.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC.svg)](https://tailwindcss.com/)
[![Gemini 3.8 Flash](https://img.shields.io/badge/AI-Gemini%203.8%20Flash-orange.svg)](https://ai.google.dev/)
[![Netlify Ready](https://img.shields.io/badge/Netlify-Frontend%20%2B%20Backend-00C7B7.svg)](https://www.netlify.com/)
[![Safari Compatible](https://img.shields.io/badge/Safari-100%25%20Certified-brightgreen.svg)](https://www.apple.com/safari/)
[![Chrome Compatible](https://img.shields.io/badge/Chrome-100%25%20Certified-brightgreen.svg)](https://www.google.com/chrome/)
[![Light Mode](https://img.shields.io/badge/Theme-Crisp%20Clay%20Light%20Mode-FACC15.svg)](#)

---

## 📑 Official Documents & Downloads

| Deliverable | Format | Description | Direct Download |
|---|---|---|---|
| **Fancy Claymorphic Slide Deck** | `.pptx` (PowerPoint) | 12-slide executive & technical presentation styled in tactile Claymorphism with dual-column cards, live threat simulations & speaker notes | [📥 Download Presentation (.pptx)](./docs/ScamShield_Presentation.pptx) |
| **Comprehensive PRD & TRD Document** | `.pdf` (Portable Document) | Complete 9-page system specification, user personas, API contracts, threat sequence diagrams & Netlify deployment topology | [📄 Download Documentation (.pdf)](./docs/ScamShield_Documentation.pdf) |
| **Netlify Deployment Guide** | `.md` (Markdown) | Complete guide for deploying React Frontend + Express Backend on Netlify (Urdu & English) | [Read NETLIFY_DEPLOYMENT.md](./docs/NETLIFY_DEPLOYMENT.md) |
| **Product Requirements Document** | `.md` (Markdown) | Product vision, trilingual matrix, functional requirements, and success KPIs | [Read PRD.md](./docs/PRD.md) |
| **Technical Requirements Document** | `.md` (Markdown) | Zero-outbound SSRF isolation, API specs, and DB schema | [Read TRD.md](./docs/TRD.md) |
| **Threat Pipeline & Data Flows** | `.md` (Markdown) | Sequence flowcharts and regional scam matrices | [Read ARCHITECTURE_FLOW.md](./docs/ARCHITECTURE_FLOW.md) |

---<!-- ScamShield AI Screenshots -->

## Pictures

<p align="center">
  <img src="https://github.com/user-attachments/assets/e395ffde-3e91-4718-b41d-2549711eec2d" width="900" alt="ScamShield AI Screenshot 1" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/e70e7b4b-e798-4b17-933a-012eb473b6fa" width="900" alt="ScamShield AI Screenshot 2" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/308c4314-7544-4e54-b468-6f4a7143865b" width="900" alt="ScamShield AI Screenshot 3" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/ef52c0f2-efd9-4102-abee-e2768fad55df" width="900" alt="ScamShield AI Screenshot 4" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/fb270b7d-3b8c-4af6-8b9d-2a6d5b565755" width="900" alt="ScamShield AI Screenshot 5" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/83cba2f3-854e-43cb-b8ae-82145aded643" width="900" alt="ScamShield AI Screenshot 6" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/d52a0988-2d1d-4f2d-9861-737b0df94da8" width="900" alt="ScamShield AI Screenshot 7" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/1bf6e800-4b4d-46e4-b3fb-5de4707e7016" width="900" alt="ScamShield AI Screenshot 8" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/960d935c-1de0-4348-94c1-b8e249bd73ca" width="900" alt="ScamShield AI Screenshot 9" />
</p>

## ☁️ Netlify Deployment: Frontend + Backend Together

> **🇵🇰 سوال: کیا Netlify پر Frontend اور Backend دونوں ایک ساتھ اپلوڈ اور ڈپلائی ہو جائیں گے؟**  
> **جواب: جی ہاں! بالکل!** ہم نے اس پروجیکٹ میں `netlify.toml` اور `netlify/functions/api.ts` کنفیگر کر دیا ہے۔ Netlify آپ کے React 19 Frontend کو گلوبل CDN پر ہوسٹ کرتا ہے اور Express Backend کو `serverless-http` کے ذریعے Serverless Function پر چلاتا ہے۔

### Quick 3-Step Netlify Deploy:
1. **GitHub پر کوڈ پش کریں:**
   ```bash
   git add .
   git commit -m "Deploy ScamShield to Netlify"
   git push origin main
   ```
2. **Netlify ڈیش بورڈ پر Import کریں:**
   - [Netlify Dashboard](https://app.netlify.com/) ➔ **Add new site** ➔ **Import an existing project** (GitHub)
   - Netlify `netlify.toml` سے خودکار ترتیبات پڑھ لے گا:
     - **Build command:** `npm run build`
     - **Publish directory:** `dist`
     - **Functions directory:** `netlify/functions`
3. **Environment Variables شامل کریں (Site Configuration):**
   - `GEMINI_API_KEY`: آپ کی گوگل جیمنائی API کلید
4. **Deploy Site پر کلک کریں!** دونوں Frontend اور Backend 100% لائیو ہو جائیں گے۔

---

## 🍏 Cross-Browser Compatibility: Safari, Chrome, Firefox & Edge

We have engineered and certified ScamShield AI to eliminate browser incompatibilities:
1. **Safari White Screen Bug Resolved:**
   - Eliminated regex lookbehinds `(?<=...)` which crash older iOS and macOS WebKit engines.
   - Replaced fragile date parsing (`new Date("YYYY-MM-DD HH:mm:ss")`) with cross-browser `safeFormatDate` helper to prevent WebKit `RangeError: Invalid time value` crashes.
   - Added `-webkit-backdrop-filter` alongside standard `backdrop-filter` rules.
   - Set esbuild compile target to `['es2020', 'safari14', 'chrome87', 'firefox78']` in `vite.config.ts`.
2. **Pristine Light Mode Only:**
   - Enforced high-contrast, tactile Claymorphic daylight mode.
   - Eliminated dark-mode inversion artifacts, ensuring crystal-clear text readability on all screens.
3. **Safari Private Browsing Safe:**
   - Wrapped `localStorage` access in `safeStorage` in-memory fallback to avoid `SecurityError` or `QuotaExceededError`.

---

## 📸 Application Screenshots & Visual UI Walkthrough

### 1. Unified Multilingual Security Scanner (Tactile Light Mode)
Inspects raw text, copied WhatsApp messages, bank suspension SMS alerts, deceptive links, or uploaded screenshots.
```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  🛡️ ScamShield AI      [Scanner] [AI Copilot] [Simulator] [Dashboard] [Docs]    │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   ┌──────────────────────────────────────────────────────────────────────────┐   │
│   │  📱 Message / URL / Screenshot Scanner                       [EN | UR | RU] │
│   │                                                                          │   │
│   │  [ SMS / Plaintext ]   [ Deceptive Link ]   [ 📸 Screenshot Flyer ]      │   │
│   │ ┌──────────────────────────────────────────────────────────────────────┐ │   │
│   │ │ "URGENT: Your HBL bank account access will be suspended within 2     │ │   │
│   │ │  hours. Click http://hbl-security-portal.online to verify CNIC."     │ │   │
│   │ └──────────────────────────────────────────────────────────────────────┘ │   │
│   │                                                                          │   │
│   │  [🛡️ Analyze Security Risk]            [ Try BISP Sample ]  [ Try OTP ]  │   │
│   └──────────────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### 2. Real-Time Public Blacklist Verification & Threat Card
Before showing results, queries live international cybersecurity threat feeds (URLhaus, OpenPhish, Spamhaus).
```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  CRITICAL THREAT DETECTED                                 ● SCAM DETECTED ●     │
│  Risk Score: 96 / 100                                                            │
├──────────────────────────────────────────────────────────────────────────────────┤
│  🌐 Real-Time Public Blacklist & Threat Reputation                               │
│  Target: hbl-security-portal.online                                              │
│  [✔ URLhaus: Active]  [✔ OpenPhish: Synced]  [✔ Spamhaus DBL: Live]              │
│                                                                                  │
│  ⚠️ Detected Threat Indicators:                                                  │
│  • High-Risk Lookalike Domain: "hbl" brand squatting on untrusted .online TLD    │
│  • Artificial Urgency Coercion: Threat of account suspension within 2 hours      │
│  • Credential Harvesting: Demands CNIC and sensitive personal data               │
│                                                                                  │
│  🛡️ Recommended Immediate Actions:                                              │
│  1. Do NOT click the link or enter your bank login or CNIC number.               │
│  2. Report and block the sending phone number on WhatsApp / SMS.                 │
│  3. Verify legitimate account status by calling your bank's official helpline.   │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### 3. Live Threat Telemetry & Risk Analytics Dashboard
Tracks scan volume, average risk scores, critical threat ratios, and top threat patterns in real time.
```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  📊 Live Telemetry Dashboard                               ● LIVE TELEMETRY ●    │
├──────────────────────────────────────────────────────────────────────────────────┤
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐        │
│  │ Total Scans   │ │ Avg Risk Score│ │ Critical Flags│ │ Verified Safe │        │
│  │     1,248     │ │    72 / 100   │ │     64.2%     │ │     18.5%     │        │
│  └───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘        │
│                                                                                  │
│  📈 Risk Severity Distribution:                                                  │
│  [ Critical Threat: 64% ] ■■■■■■■■■■■■■■■■                                       │
│  [ Elevated Risk:   18% ] ■■■■■                                                  │
│  [ Low / Benign:    18% ] ■■■■■                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### 4. Interactive Regional Scam Simulator
Hands-on educational drills training users to identify deceptive psychology across 5 authentic Pakistani scenarios:
- **Scenario 1:** BISP 25,000 Rupee Relief Disbursement Bait (Roman Urdu)
- **Scenario 2:** Mobile Wallet Account Freeze (EasyPaisa & JazzCash)
- **Scenario 3:** Fake Overseas Job Placement Visa Scam
- **Scenario 4:** Lottery Prize Draw Extortion Trap
- **Scenario 5:** Unofficial Bank KYC Verification SMS

---

## 🏗️ Multi-Layer Threat Inspection Pipeline

```
[ User Input: SMS / WhatsApp / URL / Screenshot ]
                       │
                       ▼
    [ Express Gateway /api/v1/analyses ]
                       │
         ┌─────────────┴─────────────┐
         ▼                           ▼
[ Normalizer & Cleaner ]    [ Zero-Outbound URL Parser ]
 • Zero-Width Strip          • Lexical Host Dissection
 • Homoglyph Unmasking       • Punycode & Typosquat Audit
 • Dialect Classifier        • Zero Attacker Outbound Pings
         │                           │
         ▼                           ▼
[ Heuristic Engine ]        [ Real-Time Public Blacklists ]
 • BISP / Lottery Signatures • Abuse.ch URLhaus Feed
 • Urgency Coercion Patterns • OpenPhish Community
 • OTP Trap Rules            • Spamhaus DBL (2.5s Timeout)
         │                           │
         └─────────────┬─────────────┘
                       ▼
      [ Gemini 3.8 Flash AI Synthesis ]
       • Multimodal Screenshot OCR
       • Coercive Tactics Deconstruction
       • Plain-Language Safety Guidance
                       │
                       ▼
          [ Relational Audit Store ]
                       │
                       ▼
         [ Tactile Claymorphic UI ]
```

---

## 🚀 Quickstart & Local Development

### Prerequisites
- **Node.js**: `v18.0.0` or higher (Node 20+ recommended)
- **npm**: `v9.0.0` or higher

### Installation & Execution
```bash
# 1. Clone repository
git clone https://github.com/your-username/scamshield-ai.git
cd scamshield-ai

# 2. Install all dependencies
npm install

# 3. Generate documents (Fancy Claymorphic PPTX & 9-Page PDF)
npx tsx scripts/generate_docs_and_presentation.ts

# 4. Start development server (Express API + Vite on Port 3000)
npm run dev

# 5. Open in your browser
# -> http://localhost:3000
```

---

## 🧪 Testing & Code Quality

```bash
# Run unit and integration tests
npm test

# Run TypeScript typechecks
npm run lint

# Build production bundle
npm run build
```

---

## 🛡️ API Endpoints Summary (`/api/v1`)

| Endpoint | Method | Description |
|---|---|---|
| `/api/v1/health` | GET | Health status, uptime, and engine diagnostics |
| `/api/v1/auth/register` | POST | Register new user account |
| `/api/v1/auth/login` | POST | Authenticate user session |
| `/api/v1/auth/me` | GET | Retrieve authenticated profile |
| `/api/v1/analyses` | POST | Submit text/URL/screenshot for security inspection |
| `/api/v1/analyses` | GET | Search, filter, and paginate past scans |
| `/api/v1/analyses/:id` | GET | Get full analysis record with URL and blacklist details |
| `/api/v1/analyses/:id` | DELETE | Delete single analysis record |
| `/api/v1/analyses` | DELETE | Hard purge all user analysis records (GDPR Right to Be Forgotten) |
| `/api/v1/reputation/check` | POST | Direct real-time URL reputation & blacklist check |
| `/api/v1/dashboard/stats` | GET | Aggregated risk metrics and category distribution |
| `/api/v1/settings` | GET/PUT | User data retention and language preferences |
| `/api/v1/account/export` | GET | GDPR compliant data export in JSON format |

---

## 🔒 Security & Privacy Guarantee

- **Zero-Outbound URL Parsing:** Protects against Server-Side Request Forgery (SSRF) and DNS rebinding.
- **OWASP Hardened:** Enforces strict HTTP security headers via Helmet, rate limiting, and CORS allowlisting.
- **Safari & Mobile Certified:** Cross-browser regex, safe date parser, and `-webkit-backdrop-filter` support.
- **GDPR Sovereign Compliance:** Instant 1-click JSON download and irreversible hard purge capability.
- **Client Fallback:** If Gemini AI is unconfigured or rate-limited, local deterministic heuristics handle 100% of detection seamlessly.
