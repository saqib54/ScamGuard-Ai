# ScamShield AI — "Think Before You Click"

ScamShield AI is an intelligent, privacy-first cybersecurity assistant that empowers individuals and organizations to safely inspect suspicious messages (SMS, WhatsApp, Phishing Emails) and deceptive URLs across English, Urdu, and Roman Urdu before interacting with them.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following key decisions were confirmed during requirements alignment:

- **Confirmed Decision 1 (Persistence Strategy)**: Embedded SQL engine (SQLite with SQL query layer) for instant, zero-friction local execution in the preview environment, bundled with production-grade PostgreSQL migration scripts, DDL schemas, and Docker Compose configurations.
- **Confirmed Decision 2 (Analysis Engine Approach)**: Hybrid multi-layer analysis engine combining deterministic heuristic/regex indicators, URL structural security analysis, and server-side Gemini AI (`gemini-3.8-flash` via `@google/genai`) with automatic fallback to deterministic scoring if API quota or connectivity is interrupted.
- **Confirmed Decision 3 (Multilingual Experience)**: Automatic language detection for English, Urdu (Arabic/Nastaliq script with RTL support), and Roman Urdu with a manual language selector override in the scanner interface.

---

### 1. Overview & Core Concept

- **What It Does**: ScamShield AI accepts arbitrary suspicious messages or URLs, normalizes the text, evaluates phishing and fraud risk on a transparent 0–100 scale, identifies concrete warning indicators with highlighted evidence, explains the psychological or technical deception mechanisms, and offers actionable step-by-step guidance.
- **Target Audience / Persona**: Everyday consumers, digital banking customers, elderly users, and non-technical staff frequently targeted by SMS smishing, fake lottery/prizes, BISP/bank impersonations, OTP theft, and WhatsApp credential-harvesting attacks.
- **Key Value**: Replaces anxiety and uncertainty with immediate, transparent clarity without false guarantees ("Never claim a message is definitively safe; communicate uncertainty and limitations with integrity").

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. *Public Orientation & Education*: Users explore the landing page, learn warning patterns, review genuine sample analyses (smishing, lottery fraud, bank impersonation), and read privacy and cookie policies.
  2. *Scanning & Inspection*: Users select input format (SMS, WhatsApp, Email, URL) or paste directly. Language auto-detects English, Urdu, or Roman Urdu. The scanner validates input length, sanitizes input safely, and executes multi-tier inspection.
  3. *Transparent Assessment*: Users receive a detailed report displaying an estimated risk score (0–100), risk band (Low, Elevated, High, Critical), analysis method tag (Hybrid, Heuristic Rules, AI Engine), specific warning signs matched with evidence, psychological tactics detected (e.g. artificial urgency, impersonation, credential harvesting), and safe handling instructions.
  4. *URL Deep Dive*: Deceptive domain structures, typosquatting, suspicious IP hosts, multiple subdomains, and obfuscations are parsed safely on the backend without triggering outbound navigations or SSRF risks.
  5. *History & Privacy*: Users review past scans, search by category or keyword, filter by risk band, export records (JSON/CSV), or execute irreversible data deletion with full audit compliance.
  6. *Safety Center & Account*: Comprehensive educational guides on OTP defense, impersonation verification, official emergency contacts, and personalized account/retention preferences.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Refined, professional cybersecurity intelligence console. Clean, calm, credible, and devoid of neon slop, faux-matrix effects, or decorative empty charts.
  - *Color Palette & Tokens*:
    - Canvas Background: Warm off-white / light neutral canvas (`#FBFBFA` / `#F4F4F1`) and dark slate counterpart (`#0F172A`).
    - Primary Brand: Deep Forest Green (`#166534` / `#15803D`) symbolizing protective vigilance and trust.
    - Typography: Charcoal body (`#1E293B`) with high contrast.
    - Semantic Risk Accents:
      - Low Risk / Safe Advice: Emerald (`#15803D`)
      - Elevated / Moderate Risk: Warm Amber (`#B45309`)
      - High / Critical Risk: Crimson (`#B91C1C`)
  - *Typography & Hierarchy*: Display headings in `Plus Jakarta Sans` / `Outfit`, body text in `DM Sans` / `Inter`, numeric data and scores in tabular figures (`font-mono` / `tabular-nums`). Urdu text rendered with appropriate line-height and right-to-left directional styling.
  - *Component Styling & Layout*:
    - Adheres to the Zero-Pill discipline: static metadata uses clean unboxed text separated by typographic mid-dots (`·`).
    - High-density data tables, single-elevation surfaces with 1px hairline borders (`border-neutral-200/80`), visible `focus-visible` accessibility rings, and responsive drawer/modal controls.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Deterministic Engine as Foundation, Gemini as Semantic Enhancer**
  - *Chosen Approach*: The local heuristic rules engine detects known patterns (OTP solicitation, fake prize claims, lottery keywords, urgent account freezes, financial scams, Roman Urdu terms like `inaam`, `lottery`, `account block`, `OTP share karein`, `Benazir income`) deterministically in milliseconds. The server-side Gemini 3.8 Flash model enhances this with nuanced contextual reasoning when available. If Gemini is unreachable or unconfigured, the deterministic rules guarantee complete, uninterrupted operation.
  - *Why*: Eliminates single points of failure, ensures instantaneous response times, prevents service lockouts, and protects user privacy.
  - *Alternatives Considered*: Pure LLM analysis (rejected due to rate limits, latency, cost, and hallucination risks).

- **Decision 2: Dual Persistence Model (Embedded Relational Engine + PostgreSQL Production Suite)**
  - *Chosen Approach*: Embedded relational database (SQLite via SQL abstraction) running inside the Node.js Express backend for immediate plug-and-play capability without requiring external cloud credentials or local Docker daemon setup during live testing. Concurrently, provide full PostgreSQL DDL migrations (`migrations/001_initial_schema.sql`), connection pool configurations (`pg`), Docker Compose, and environment switches (`DB_DIALECT=sqlite|postgres`).
  - *Why*: Guarantees instant 100% build and test pass rate in development while honoring enterprise production deployment requirements.

- **Decision 3: Zero-Outbound URL Parsing & SSRF Defense**
  - *Chosen Approach*: Pure lexical, structural, and cryptographic parsing of user-submitted URLs (hostnames, punycode, IP addresses, private CIDR blocks, unusual ports, suspicious TLDs, keyword spoofing). Never issue outbound HTTP GET/HEAD requests to submitted links from the server.
  - *Why*: Strict prevention of Server-Side Request Forgery (SSRF), internal network probing, and malicious payload triggering.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           SCAMSHIELD AI APPLICATION                             │
└─────────────────────────────────────────────────────────────────────────────────┘
                                         │
        ┌────────────────────────────────┴────────────────────────────────┐
        ▼                                                                 ▼
┌─────────────────────────────────┐                     ┌─────────────────────────────────┐
│     CLIENT (REACT + VITE)       │                     │    SERVER (NODE.JS + EXPRESS)   │
│                                 │                     │                                 │
│  ┌───────────────────────────┐  │                     │  ┌───────────────────────────┐  │
│  │ Top Navigation & Language │  │   REST /api/v1/*    │  │ Security Headers & Helmet │  │
│  │ (English / Urdu RTL / RU) │  ├────────────────────►│  │ Rate Limiting & Auth Guard│  │
│  └───────────────────────────┘  │                     │  └─────────────┬─────────────┘  │
│  ┌───────────────────────────┐  │                     │                ▼                │
│  │ View Routing & Layout     │  │                     │  ┌───────────────────────────┐  │
│  │ • Landing & How It Works  │  │                     │  │ Modular Analysis Pipeline │  │
│  │ • Message Scanner         │  │                     │  │ 1. Normalizer & Sanitizer │  │
│  │ • Analysis Report         │  │                     │  │ 2. Heuristic Rules Engine │  │
│  │ • URL Deep Inspector      │  │                     │  │ 3. URL Structural Parser  │  │
│  │ • History & Export        │  │                     │  │ 4. Gemini 3.8 Flash (Opt) │  │
│  │ • Safety Center           │  │                     │  │ 5. Aggregator & Scorer    │  │
│  │ • Settings & Privacy      │  │                     │  └─────────────┬─────────────┘  │
│  └───────────────────────────┘  │                     │                ▼                │
│  ┌───────────────────────────┐  │                     │  ┌───────────────────────────┐  │
│  │ Client State & Session    │  │                     │  │ Data Access Layer         │  │
│  │ • User / Guest Mode       │  │                     │  │ • SQLite (Local Dev)      │  │
│  │ • Cookie Consent Manager  │  │                     │  │ • PostgreSQL (Production) │  │
│  └───────────────────────────┘  │                     │  └───────────────────────────┘  │
└─────────────────────────────────┘                     └─────────────────────────────────┘
```

#### Core Entities & Schemas
- `users`: ID, email, password_hash (Argon2 / scrypt-derived PBKDF2), role, created_at, updated_at.
- `analyses`: ID, user_id (optional for guest sessions), input_type (sms, whatsapp, email, url), detected_language, raw_snippet_masked, risk_score (0–100), risk_level (low, elevated, high, critical), indicators (JSON array), tactics (JSON array), recommendations (JSON array), engine_type (hybrid, rules, gemini), created_at.
- `analysis_feedback`: ID, analysis_id, user_id, rating (accurate / inaccurate), comment, created_at.
- `user_settings`: ID, user_id, retention_days, auto_delete, language_preference.
- `audit_logs`: ID, event_type, actor_id, ip_hash, timestamp.

#### Interactive Component & State Mapping
- `ScannerForm`: Validates character limits (max 5,000 chars), triggers `POST /api/v1/analyses`, manages loading state with step-by-step progress simulation (Normalizing -> Heuristics -> Deep Inspection -> Synthesis), and handles server validation errors.
- `AnalysisReportCard`: Displays gauge/score indicator, breakdown of detected signals, highlighted message substrings, explanations of threat mechanisms, and interactive "Copy Report", "Export PDF/JSON", and "Report Inaccuracy" controls.
- `HistoryView`: Live search filter, risk level filter, pagination (10 per page), batch delete with confirmation dialog, and CSV/JSON export.
- `SafetyCenter`: Interactive accordion of threat types (OTP Smishing, Prize Scams, Impersonation) with verified helpline directory.
- `PrivacyModal / CookieBanner`: Granular consent state (Strictly Necessary, Analytics) persisted with revocable preference controls.
