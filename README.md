# ScamShield AI — "Think Before You Click" 🛡️

ScamShield AI is an enterprise-grade, privacy-first cybersecurity assistant engineered to empower everyday digital citizens to inspect suspicious messages (SMS, WhatsApp, Phishing Emails), deceptive URLs, and screenshot flyers across **English, Urdu (اردو), and Roman Urdu** before interacting with them.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-5.0-lightgrey.svg)](https://expressjs.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC.svg)](https://tailwindcss.com/)
[![Gemini 3.8 Flash](https://img.shields.io/badge/AI-Gemini%203.8%20Flash-orange.svg)](https://ai.google.dev/)
[![Safari Compatible](https://img.shields.io/badge/Safari-100%25%20Verified-brightgreen.svg)](https://www.apple.com/safari/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📑 Official Documents & Downloads

| Document | Format | Description | Direct Download |
|---|---|---|---|
| **Pitch & Technical Presentation** | `.pptx` (PowerPoint) | 12-slide executive & technical slide deck with notes | [📥 Download Presentation (.pptx)](./docs/ScamShield_Presentation.pptx) |
| **Comprehensive PRD & TRD** | `.pdf` (Portable Document) | Complete system architecture, user personas, API contracts & schema | [📄 Download Documentation (.pdf)](./docs/ScamShield_Documentation.pdf) |
| **Product Requirements Document** | `.md` (Markdown) | Product vision, functional requirements, and success KPIs | [Read PRD.md](./docs/PRD.md) |
| **Technical Requirements Document** | `.md` (Markdown) | Zero-outbound SSRF isolation, API specs, and DB schema | [Read TRD.md](./docs/TRD.md) |
| **Threat Pipeline & Data Flows** | `.md` (Markdown) | Sequence flowcharts and regional scam matrices | [Read ARCHITECTURE_FLOW.md](./docs/ARCHITECTURE_FLOW.md) |

---

## 📸 Application Screenshots & Visual UI Walkthrough

### 1. Unified Multilingual Security Scanner
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
│  │      1,248    │ │    64 / 100   │ │      412      │ │      836      │        │
│  └───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘        │
│                                                                                  │
│  Risk Distribution Breakdown:                                                    │
│  Critical Threat [█████████████████████░░░░░░░░] 33%                             │
│  Elevated Risk   [████████░░░░░░░░░░░░░░░░░░░░] 12%                             │
│  Verified Benign [████████████████████████████] 55%                             │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### 4. Interactive 12-Slide Pitch & Technical Deck Viewer
Built-in slide presentation viewer with slide outline, speaker notes, and instant `.pptx` & `.pdf` export buttons.
```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  📊 Documentation & Presentation Deck                     ● OFFICIAL SPEC ●      │
│  [📥 Download Slides (.pptx)]  [📄 Download Docs (.pdf)]                         │
├──────────────────────────────────────────────────────────────────────────────────┤
│  [ Slides Deck (12) ]   [ PRD Document ]   [ TRD Architecture ]  [ Threat Flows ]│
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐  │
│  │  SLIDE 4 OF 12 · REAL-TIME BLACKLISTS                                      │  │
│  │  Live Public Threat Intelligence Feeds                                     │  │
│  │                                                                            │  │
│  │  • Integrated with Abuse.ch URLhaus: Real-time malware URL database        │  │
│  │  • OpenPhish Community Feed: Zero-day banking credential phishing targets   │  │
│  │  • Spamhaus Domain Blocklist (DBL): Suspicious domain reputation registry   │  │
│  │  • Parallel Promise.allSettled with 2.5s strict timeout and LRU caching     │  │
│  │                                                                            │  │
│  │  [ < Previous Slide ]       ● ● ● ● ○ ○ ○ ○ ○ ○ ○ ○      [ Next Slide > ]  │  │
│  └────────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🌟 Key Capabilities & Features

### 1. Multi-Format & Multimodal Security Scanner
- **SMS & Plaintext:** Real-time triage for bank suspension alerts, OTP harvesting, urgency coercion, and fraudulent lottery/relief schemes (BISP, Ehsaas).
- **Zero-Outbound URL Inspector:** Dissects hostnames, top-level domains, IP addresses, brand-squatting heuristics, and punycode/homoglyph lookalikes without ever pinging the attacker server (SSRF-immune).
- **Screenshot Vision Radar:** Multimodal image extraction via Gemini 3.8 Flash Vision to inspect fraudulent chat screenshots and flyer graphics.
- **Trilingual Intelligence:** Native support for English, Urdu (اردو), and Roman Urdu phonetic fraud markers.

### 2. Real-Time Public URL Reputation & Blacklist Verification
Before presenting an analysis result, ScamShield queries suspicious links and domains in real time against authoritative open cybersecurity threat feeds:
- **Abuse.ch URLhaus:** Active malware and payload distribution URLs.
- **OpenPhish Community Feed:** Live credential-harvesting phishing targets.
- **Spamhaus DBL & SURBL:** Domain reputation and blocklist verification.
- **ThreatFox IoC Engine:** Known Indicators of Compromise.
- Integrated with strict 2.5s timeouts and in-memory LRU caching for instantaneous user experience.

### 3. Tactile 3D Claymorphism Design System (Clean Light Mode)
- Tactile soft 3D clay aesthetics with die-cut stickers and washi tape cues.
- **Safari Compatible:** Hardened against storage exceptions and cross-origin iframe security restrictions.
- **Mobile Responsive:** Perfectly calibrated down to 320px screens (iPhone SE, Android) with zero horizontal overflow.

### 4. Interactive Simulation & Safety Center
- **AI Scam Simulator:** Practice identifying realistic synthetic fraud scenarios to build social engineering immunity.
- **AI Security Copilot:** Conversational assistant for threat debriefing and tactical safety advice.
- **Official Emergency Directory:** Direct contacts for FIA Cyber Crime Wing, national CERTs, and emergency banking hotlines.

### 5. Strict Zero-Trust Privacy & GDPR Governance
- **Zero Raw Message Logging:** Sensitive personal phone numbers and private messages are never written to plain server log files.
- **GDPR Data Portability:** Instant 1-click JSON export of user scan history (`/api/v1/account/export`).
- **Irreversible Hard Purge:** Single-record deletion and complete history wipe (`DELETE /api/v1/analyses`).
- **Cryptographic Security:** PBKDF2 password hashing with 100,000 rounds and unique salt generation.

---

## 🏗️ Technical Stack & Architecture

```
+-------------------------------------------------------------------------------+
|                             CLIENT TIER (React SPA)                           |
|  - React 19 + TypeScript + Tailwind CSS                                       |
|  - Claymorphism 3D Tactile Design System (Pristine Light Mode)                |
|  - Safari-Safe Storage Layer with In-Memory Fallback                          |
|  - Multilingual Context (English, Urdu, Roman Urdu)                           |
|  - Built-in Interactive PRD, TRD & Presentation Deck Viewer                   |
+-------------------------------------------------------------------------------+
                                      |
                             HTTPS / REST API / JSON
                                      v
+-------------------------------------------------------------------------------+
|                       EXPRESS API GATEWAY & SECURITY                          |
|  - Port 3000 Node.js Server                                                   |
|  - Helmet HTTP Security Headers (Safari & IFrame Compatible)                  |
|  - Distributed Rate Limiter & Request ID Tracing                              |
|  - Static Asset Delivery Engine (Express Static)                              |
+-------------------------------------------------------------------------------+
                                      |
            +-------------------------+-------------------------+
            |                                                   |
            v                                                   v
+------------------------------------+   +------------------------------------+
|     INSPECTION & ANALYSIS PIPELINE |   |     IDENTITY & DATA MANAGEMENT     |
|  1. Input Normalizer (Zero-Width)  |   |  - PBKDF2 Password Hashing (100k)  |
|  2. Zero-Outbound SSRF URL Parser  |   |  - Session Token Storage           |
|  3. Real-Time Public Blacklists:   |   |  - Relational Store (SQLite / PG)  |
|     * Abuse.ch URLhaus             |   |  - GDPR Export & Hard Purge Engine |
|     * OpenPhish Feed               |   +------------------------------------+
|     * Spamhaus DBL                 |
|     * ThreatFox IoC                |
|  4. Deterministic Heuristic Engine |
|  5. Gemini 3.8 Flash Vision / NLP  |
+------------------------------------+
```

---

## 🚀 Quickstart & Local Development

### Prerequisites
- **Node.js**: `v18.0.0` or higher (Node 20+ recommended)
- **npm**: `v9.0.0` or higher

### Installation & Execution
```bash
# 1. Clone or navigate to the repository
cd scamshield-ai

# 2. Install all dependencies
npm install

# 3. Generate documents (PPTX & PDF)
npx tsx scripts/generate_docs_and_presentation.ts

# 4. Start development server (Express API + Vite on Port 3000)
npm run dev

# 5. Open in your browser
# -> http://localhost:3000
```

### Pre-Configured Evaluation Account
To test authenticated features, history management, and GDPR exports without manual registration:
- **Email:** `analyst@scamshield.ai`
- **Password:** `DemoSecure123!`

---

## 🐳 Docker & PostgreSQL Production Deployment

To run in production mode with a dedicated **PostgreSQL 16** relational database:

```bash
# Build and start services in the background
docker-compose up --build -d

# Verify container health
docker-compose ps

# Access the application
# -> http://localhost:3000
```

---

## 🧪 Testing & Code Quality

```bash
# Run unit and integration tests
npm test

# Run TypeScript typechecks and ESLint
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
| `/api/v1/analyses` | DELETE | Hard purge all user analysis records |
| `/api/v1/reputation/check` | POST | Direct real-time URL reputation & blacklist check |
| `/api/v1/dashboard/stats` | GET | Aggregated risk metrics and category distribution |
| `/api/v1/settings` | GET/PUT | User data retention and language preferences |
| `/api/v1/account/export` | GET | GDPR compliant data export in JSON format |

---

## 🔒 Security & Privacy Guarantee

- **Zero-Outbound URL Parsing:** Protects against Server-Side Request Forgery (SSRF) and DNS rebinding.
- **OWASP Top 10 Hardened:** Enforces strict HTTP security headers via Helmet, parameter validation, rate limiting, and CORS allowlisting.
- **Safari & Mobile Tested:** Safe storage fallbacks eliminate private browsing errors across WebKit and Blink engines.
- **Graceful Offline Degradation:** If Gemini AI is unconfigured or rate-limited, local deterministic heuristics handle 100% of detection seamlessly.
