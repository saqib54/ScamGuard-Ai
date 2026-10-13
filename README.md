# ScamShield AI — "Think Before You Click"

ScamShield AI is an intelligent cybersecurity assistant that helps users inspect suspicious messages (SMS, WhatsApp, Phishing Emails) and deceptive URLs across **English, Urdu, and Roman Urdu** before interacting with them.

---

## 1. Architectural Highlights

- **Multi-Layer Inspection Pipeline**:
  1. *Input Normalizer & Homoglyph Filter*: Decodes zero-width characters and detects regional language markers.
  2. *Zero-Outbound URL Inspector*: Evaluates domains, typosquatting, and IP hosts with strict SSRF defense (never makes outbound network requests).
  3. *Deterministic Heuristic Engine*: Fast pattern detection for OTP harvesting, urgency threats, BISP fraud, fake lotteries, and advance-fee schemes.
  4. *Server-Side Gemini AI (`gemini-3.8-flash`)*: Synthesizes contextual nuances when online; automatically falls back to deterministic heuristics if unconfigured or rate-limited.
- **Relational Persistence**:
  - Embedded relational store in development with full parity for PostgreSQL.
  - Production DDL migration script at `migrations/001_initial_schema.sql`.
- **Privacy & Compliance**:
  - Zero raw message storage in logs.
  - GDPR-compliant data export and irreversible user-controlled purge.
  - Granular Cookie preference controls.
- **Evaluation Account**:
  - Email: `analyst@scamshield.ai`
  - Password: `DemoSecure123!`

---

## 2. Quickstart & Local Setup

### Prerequisites
- Node.js 18+ or 20+
- npm 9+

### Commands
```bash
# 1. Install dependencies
npm install

# 2. Start full-stack development server (Express + Vite on Port 3000)
npm run dev

# 3. Run unit tests
npm test

# 4. Typecheck and linting
npm run lint

# 5. Build for production
npm run build
```

---

## 3. Docker & Production Deployment

To run with PostgreSQL 16 via Docker Compose:
```bash
docker-compose up --build -d
```
The application will be available at `http://localhost:3000` with persistent database storage in PostgreSQL.

---

## 4. API Endpoints Contract (`/api/v1`)

| Endpoint | Method | Description |
|---|---|---|
| `/api/v1/health` | GET | Service status, engine mode, and diagnostics |
| `/api/v1/auth/register` | POST | Create user account |
| `/api/v1/auth/login` | POST | Authenticate user session |
| `/api/v1/analyses` | POST | Submit content for security inspection |
| `/api/v1/analyses` | GET | Search, filter, and paginate scan history |
| `/api/v1/analyses/:id` | GET | Retrieve full individual analysis record |
| `/api/v1/analyses/:id` | DELETE | Delete single analysis record (ownership enforced) |
| `/api/v1/analyses` | DELETE | Purge all user analysis records |
| `/api/v1/analyses/:id/feedback` | POST | Submit accuracy feedback or correction |
| `/api/v1/dashboard/stats` | GET | Aggregated risk metrics and distribution |
| `/api/v1/settings` | GET/PUT | User data retention and language preferences |
| `/api/v1/account/export` | GET | GDPR data export in JSON format |

---

## 5. Security & Verification Checklist

- [x] OWASP Top 10 defenses enforced (Helmet security headers, strict body limits, parameterized SQL/storage).
- [x] Zero-outbound URL parsing eliminates Server-Side Request Forgery (SSRF).
- [x] Rate limiting per IP and per endpoint on sensitive routes.
- [x] No plaintext passwords; PBKDF2 with 100,000 rounds and unique cryptographic salts.
- [x] Graceful degradation: heuristic engine operates deterministically when external AI is offline.
