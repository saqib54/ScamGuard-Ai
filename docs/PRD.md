# Product Requirements Document (PRD)
## Project: ScamShield AI — "Think Before You Click"
**Document Version:** 2.1.0  
**Status:** Approved & Implemented  
**Target Audience:** Mobile banking consumers, multilingual smartphone users, digital citizens, fraud investigators  
**Product Owner:** ScamShield Engineering & Product Team  

---

## 1. Executive Summary & Vision

### 1.1 Product Vision
**ScamShield AI** is an intelligent, privacy-first cybersecurity verification platform designed to empower everyday digital citizens to **"Think Before You Click"**. The platform demystifies social engineering by instantly inspecting suspicious SMS messages, WhatsApp alerts, phishing emails, deceptive URLs, and screenshots across **English, Urdu, and Roman Urdu**.

### 1.2 Core Value Proposition
- **Pre-Click Verification:** Intercepts fraudulent solicitations before users surrender credentials, CNIC, or OTPs.
- **Multilingual & Regional Intelligence:** Calibrated specifically for fraud patterns common in South Asia and global diaspora (e.g., BISP relief fraud, lottery bait, fake bank suspension notices).
- **Real-Time Public Blacklist Checking:** Validates suspicious URLs against open cybersecurity intelligence feeds (Abuse.ch URLhaus, OpenPhish, Spamhaus DBL, ThreatFox) in real time before revealing risk analysis.
- **Multimodal Visual Intelligence:** Accepts screenshots of fraudulent messages and parses visual layout cues via Gemini 3.8 Flash Vision.
- **Zero-Trust Privacy:** Strict zero-outbound SSRF isolation (never contacts attacker servers), zero plaintext message storage in logs, and GDPR-compliant user data ownership.

---

## 2. Problem Statement & Market Opportunity

### 2.1 The Epidemic of Social Engineering
- Over 85% of modern credential breaches originate with SMS phishing (Smishing) or WhatsApp impersonation.
- Conventional antivirus software and email spam filters protect enterprise desktop inboxes but offer zero protection inside private WhatsApp groups, P2P SMS, or regional chat apps.
- Victims in South Asia and developing markets face high vulnerability due to scams rendered in **Roman Urdu** (e.g., *"Apka account block ho gaya hai, foran rabta karein"*), which bypass conventional English-only NLP scanners.

### 2.2 Target User Personas
1. **Persona A: Everyday Mobile Banking Consumer ("Ayesha", 32)**
   - *Needs:* Receives a text claiming her mobile wallet or bank account is frozen. Needs a 5-second check to confirm if the sender number and link are legitimate.
2. **Persona B: Senior Citizen / Digitally Emerging User ("Haji Sahab", 65)**
   - *Needs:* Receives fake lottery or relief grant notifications in Urdu. Needs clear, high-contrast, simple color-coded guidance (Green = Safe, Red = Dangerous) with actionable advice in their own language.
3. **Persona C: Cybersecurity Analyst / Tier-1 SOC ("Farhan", 28)**
   - *Needs:* Wants structural URL breakdowns, punycode/homoglyph detection, MITRE ATT&CK technique mapping, and blacklist lookup results without risky outbound connections.

---

## 3. Goals & Non-Goals

### 3.1 Business & Product Goals
- Provide sub-second deterministic threat detection for high-confidence scam templates.
- Maintain **100% Client Safety** via zero-outbound SSRF isolation.
- Support responsive usage across smartphones (down to 320px screen width) and desktops.
- Offer an accessible Claymorphic tactile UI with high-contrast daylight and night modes.
- Achieve 95%+ detection rate on regional fraud patterns (BISP, lottery, OTP harvesting, fake couriers).

### 3.2 Non-Goals
- **No Active Counter-Attacks:** ScamShield will not probe, scrape, or perform active denial-of-service against malicious infrastructure.
- **No Absolute Guarantees:** The product never labels an unlisted message as "100% Guaranteed Safe" — it provides transparent, evidence-based risk indicators.
- **No Invasive Telemetry:** No tracking cookies, invasive keyloggers, or selling of user scan data.

---

## 4. Key Features & Functional Requirements

### 4.1 Multi-Format Inspection Engine
- **SMS / Plaintext:** Detects urgency threats, bank suspension claims, CNIC/OTP demands, and lottery bait.
- **Deceptive URLs:** Dissects protocol, IP addresses, punycode/homoglyph spoofing, top-level domain abuse, and brand lookalikes.
- **Screenshots (Multimodal Vision):** OCR extraction and visual spoofing inspection for chat app screenshots.
- **Multilingual Support:** Dynamic language switching between English, Urdu (اردو), and Roman Urdu.

### 4.2 Real-Time Public URL Reputation Service
- Queries suspicious URLs and hostnames against authoritative public threat intelligence feeds before displaying analysis:
  - **Abuse.ch URLhaus API:** Checks active malware & phishing database.
  - **OpenPhish Community Feed:** Verifies zero-day credential harvesting sites.
  - **Spamhaus Domain Blocklist (DBL) & SURBL:** Evaluates reputation of root hostnames.
  - **ThreatFox IoC Engine:** Queries known Indicators of Compromise.
- Integrated caching layer (15-minute TTL) with strict 2.5s query timeouts to guarantee instant UX.

### 4.3 Hybrid Heuristic + Gemini 3.8 Flash Engine
- **Tier 1 (Deterministic Heuristics):** Zero-latency pattern matching running locally on the server.
- **Tier 2 (Gemini 3.8 Flash):** Multimodal contextual synthesis, psychological manipulation profiling, and plain-language threat explanations.
- **Graceful Fallback:** Automatic deterministic synthesis if API quota is reached or network is offline.

### 4.4 Interactive Training & Simulation
- **AI Scam Simulator:** Allows users to simulate incoming phishing scenarios to build social engineering immunity.
- **Interactive AI Copilot:** Conversational assistant for safety advisory and scam incident debriefing.

### 4.5 Privacy & Governance
- **GDPR Data Portability:** Instant JSON export of analysis history (`/api/v1/account/export`).
- **Irreversible Purge:** Single-record deletion and full account wipe (`DELETE /api/v1/analyses`).
- **Granular Cookie Preferences:** Explicit controls for Essential, Analytics, and Security cookies.

---

## 5. User Journeys & Workflow

### 5.1 Scanning a Suspicious Link / Message
1. User copies a suspicious text or URL from WhatsApp or SMS.
2. User opens ScamShield AI on mobile or desktop (in Daylight or Night Mode).
3. User pastes the content or selects a sample test case.
4. User clicks **"Analyze Security Risk"**.
5. Server executes multi-stage pipeline:
   - Sanitizes and extracts URLs and homoglyphs.
   - Concurrently queries public blacklists (URLhaus, OpenPhish, etc.).
   - Evaluates deterministic heuristic rules.
   - Enriches with Gemini AI contextual analysis.
6. User receives an immediate Claymorphic Risk Card:
   - Risk Score (0–100) and color-coded status badge.
   - Blacklist verification status (Clean vs Listed).
   - Structural URL inspection (punycode, deceptive brands).
   - Plain-language explanation in selected language.
   - Recommended tactical actions ("Do not reply", "Block sender", "Contact official bank helpline").

---

## 6. Success Metrics & KPIs

| Metric | Target | Measurement Method |
|---|---|---|
| **Analysis Latency** | < 1.5 seconds | Server request duration timer |
| **Regional Scam Detection** | > 96% accuracy | Test benchmark suite (BISP, bank OTP, lottery) |
| **Zero-Outbound Compliance** | 100% | Network egress audit (Zero client pings to target URLs) |
| **Mobile Usability** | 0 overflow bugs | Viewport testing on iPhone SE, Pixel, Galaxy |
| **Privacy Compliance** | 100% GDPR adherence | Automated data purge and export verification tests |
