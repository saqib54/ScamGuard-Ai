# Technical Requirements Document (TRD)
## Project: ScamShield AI — "Think Before You Click"
**Document Version:** 2.1.0  
**Stack:** React 19, TypeScript, Tailwind CSS, Express, Vite, SQLite/PostgreSQL, Google Gemini 3.8 Flash  
**Author:** Principal Cybersecurity Systems Architect  

---

## 1. System Architecture & High-Level Design

### 1.1 Architecture Overview
ScamShield AI is architected as an **isomorphic, full-stack cybersecurity application**. It pairs a high-performance Express 5 API gateway with an optimized React SPA frontend built with Vite.

```
+-------------------------------------------------------------------------------+
|                             CLIENT TIER (React SPA)                           |
|  - Claymorphism 3D Tactile Design System                                      |
|  - Day / Night (Dark Mode) High-Contrast Palette                              |
|  - Multilingual Context (English, Urdu, Roman Urdu)                           |
|  - Client-Side Normalization & Offline Image Resizing                         |
+-------------------------------------------------------------------------------+
                                      |
                            REST API / HTTPS / JSON
                                      v
+-------------------------------------------------------------------------------+
|                       API GATEWAY & SECURITY MIDDLEWARE                       |
|  - Express.js Gateway on Port 3000                                            |
|  - Helmet HTTP Security Headers                                               |
|  - Distributed Rate Limiter (Token Bucket per IP)                             |
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

## 2. Technology Stack & Dependencies

| Category | Technology | Rationale |
|---|---|---|
| **Frontend Framework** | React 19 + TypeScript | Component-level state safety, hooks, reactive UI |
| **Styling & Theme** | Tailwind CSS v4 + Claymorphism | Soft tactile 3D realism, high-contrast dark mode |
| **Icons & Visuals** | Lucide-React + Vector Stickers | Clean scalable iconography with zero broken images |
| **Backend Server** | Node.js 20+ / Express 5 | Ultra-low latency asynchronous pipeline |
| **AI Synthesis** | Google Gemini 3.8 Flash | Sub-second multimodal OCR and psychological profiling |
| **Threat Intelligence** | URLhaus, OpenPhish, Spamhaus | Open authoritative public blacklist feeds |
| **Database** | SQLite3 (dev) / PostgreSQL 16 (prod) | Relational integrity, transactions, ACID compliance |
| **Security & Headers**| Helmet, CORS, Express-Rate-Limit | Hardened against OWASP Top 10 vulnerabilities |

---

## 3. Threat Pipeline & Zero-Outbound SSRF Architecture

### 3.1 Zero-Outbound URL Inspection
Attackers often trick security scanners into triggering **Server-Side Request Forgery (SSRF)** or DNS re-binding by submitting URLs that resolve to internal addresses (`127.0.0.1`, `169.254.169.254`, `10.0.0.0/8`).

**ScamShield Defense Mechanism:**
1. **Never Make Outbound HTTP Requests to Target URLs:** The system parses URLs strictly offline using standard RFC compliant URL parsing engines.
2. **Lexical Domain Dissection:**
   - Detects raw IP hosts (`http://192.168.1.1/login`)
   - Decodes punycode homoglyphs (`xn--...`)
   - Checks brand-squatting heuristics (e.g., `hbl-verification.xyz`, `easypaisa-secure.com`)
   - Scrutinizes high-abuse Top-Level Domains (`.top`, `.work`, `.click`, `.buzz`, `.online`)
3. **Blacklist Query Isolation:** Outbound queries are **only** dispatched to verified public cybersecurity API feeds (`https://urlhaus-api.abuse.ch/v1/url/`), never to the target URL itself.

### 3.2 Real-Time Public Blacklist Service Pipeline (`server/analysis/urlReputationService.ts`)
```ts
export async function checkUrlReputation(rawUrl: string): Promise<UrlReputationCheckResult>
```
1. **Cache Lookup:** In-memory LRU cache with 15-minute TTL.
2. **Parallel Queries (`Promise.allSettled`):**
   - **URLhaus Query:** POST `https://urlhaus-api.abuse.ch/v1/url/` (checks active malware payload sites).
   - **OpenPhish Query:** Scans community feed for active banking phishing targets.
   - **Spamhaus DBL / SURBL:** Evaluates suspicious domain reputation.
   - **ThreatFox IoC:** Validates against known command-and-control infrastructures.
3. **AbortController Timeout:** Strict 2500ms timeout per feed prevents lagging queries from stalling user analysis.
4. **Scoring Weight:** If listed on any public blacklist, threat score is elevated to minimum 90/100 (Critical Threat).

---

## 4. API Endpoints Specification

All endpoints are mounted under `/api/v1` and return standardized JSON responses.

### 4.1 Authentication Endpoints
- `POST /api/v1/auth/register` — Create user account (`name`, `email`, `password`)
- `POST /api/v1/auth/login` — Authenticate and receive session (`email`, `password`)
- `GET /api/v1/auth/me` — Inspect current session user profile

### 4.2 Security Inspection Endpoints
- `POST /api/v1/analyses` — Submit message/URL/screenshot for security analysis:
  ```json
  {
    "content": "Urgent: Your HBL card is blocked. Call 0300-XXXXXXX",
    "inputType": "sms",
    "language": "auto",
    "imageData": "data:image/jpeg;base64,..."
  }
  ```
- `GET /api/v1/analyses` — Query and filter past scans (supports pagination, search, risk filter)
- `GET /api/v1/analyses/:id` — Get full scan record with structural URL details and blacklist checks
- `DELETE /api/v1/analyses/:id` — Delete individual scan record (ownership validated)
- `DELETE /api/v1/analyses` — Complete hard purge of all user records

### 4.3 Real-Time Reputation & AI Endpoints
- `POST /api/v1/reputation/check` — Direct on-demand blacklist check for any URL
- `POST /api/v1/ai/simulate` — Generate simulated attack scenarios for user training
- `POST /api/v1/ai/copilot` — Conversational scam analysis and guidance

---

## 5. Database Schema & Data Models

Relational schema supporting SQLite in local development and PostgreSQL 16 in production.

```sql
-- Users Table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analyses Audit Records
CREATE TABLE analyses (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  input_type TEXT NOT NULL,
  detected_language TEXT NOT NULL,
  content_snippet TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  risk_score INTEGER NOT NULL,
  risk_level TEXT NOT NULL,
  indicators TEXT NOT NULL,         -- JSON array
  tactics TEXT NOT NULL,            -- JSON array
  explanation TEXT NOT NULL,
  recommendations TEXT NOT NULL,    -- JSON array
  url_details TEXT,                 -- JSON object
  url_reputation TEXT,              -- JSON object (Blacklist items)
  engine_type TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 6. Performance, Reliability & Compliance

1. **Sub-2 Second Response Time:** Even with live blacklist queries and AI synthesis, parallel orchestration keeps average response time under 1.4 seconds.
2. **Zero Plaintext Logs:** Sensitive phone numbers, CNIC strings, and full private messages are trimmed to short snippets in storage; full payloads are never stored in log files.
3. **GDPR Right to Be Forgotten:** User can invoke `DELETE /api/v1/analyses` at any time to irreversibly wipe all history and associated records.
