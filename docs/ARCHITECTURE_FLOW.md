# System Architecture & Threat Flowcharts
## ScamShield AI — Multi-Layer Threat Inspection Pipeline

---

## 1. High-Level Pipeline Flowchart

```
[ User Input: SMS / WhatsApp / URL / Screenshot ]
                       |
                       v
            [ 1. Input Normalizer ]
      - Zero-width character stripping
      - Regional language detector (EN / UR / RU)
      - Homoglyph & unicode uncloaking
                       |
                       +-----------------------------+
                       |                             |
     [ Contains URLs / Domain? ]            [ Plaintext / Screenshot ]
               |                                     |
               v                                     |
    [ 2. Zero-Outbound URL Inspector ]               |
      - Hostname & TLD extraction                   |
      - Punycode decoding (`xn--...`)                |
      - Brand-squatting detection                    |
               |                                     |
               +-----------------------------+       |
               |                             |       |
               v                             v       v
[ 3. Real-Time Public Blacklists ]    [ 4. Deterministic Heuristics ]
  * Abuse.ch URLhaus API                * Urgency & coercion patterns
  * OpenPhish Community Feed            * OTP harvesting signatures
  * Spamhaus DBL reputation             * BISP relief fraud rules
  * ThreatFox IoC Database              * Bank suspension patterns
  (Strict 2.5s Timeout + Cache)                      |
               |                                     |
               +----------------------+--------------+
                                      |
                                      v
                        [ 5. Gemini 3.8 Flash AI ]
                          (Online Contextual Synthesis)
                          - Multimodal Vision OCR
                          - Social engineering profiling
                          - Multilingual explanation
                          * Graceful Fallback to Heuristics
                                      |
                                      v
                       [ 6. Synthesis & Scoring Engine ]
                          - Final Risk Score (0 - 100)
                          - Threat Level: Low / Elevated / High / Critical
                          - MITRE ATT&CK TTP mapping
                          - Actionable Safety Checklist
                                      |
                                      v
                    [ 7. Relational Audit Storage & UI ]
                          - Anonymized audit record
                          - Tactile Claymorphism Card
```

---

## 2. Real-Time Public Blacklist Verification Flow

```
User submits URL (e.g. http://login-hbl-verify.online)
                       |
                       v
       [ Cache Check (15-min TTL) ]
        /                        \
    [ HIT ]                    [ MISS ]
       |                          |
   Return cached                  v
   Blacklist result     [ Parallel Query Layer ]
                        (AbortController: 2500ms)
                        /         |          \
                       /          |           \
                      v           v            v
                [ URLhaus ]  [ OpenPhish ]  [ Spamhaus / ThreatFox ]
                      \           |            /
                       \          |           /
                        v         v          v
                  [ Aggregate Feed Results ]
                        |
      +-----------------+-----------------+
      | Listed on Blacklist?              | Not Listed?
      v                                   v
  [ CRITICAL FLAG ]                [ CLEAN REPUTATION ]
  - Elevate Score to 90-100        - Pass to Heuristics & AI
  - Tag Authority & Threat Type    - Mark Blacklist feeds clean
      \                                   /
       +----------------+----------------+
                        |
                        v
         [ Attached to Final Analysis ]
```

---

## 3. Threat Mitigation & SSRF Defense Model

```
ATTACK VECTOR: Attacker inputs `http://169.254.169.254/latest/meta-data` or `http://127.0.0.1:3000/internal`

[ TRADITIONAL VULNERABLE SCANNER ]
  Scanner makes outbound HTTP GET request -> Hits internal cloud metadata -> LEAKS CREDENTIALS (SSRF)!

[ SCAMSHIELD ZERO-OUTBOUND ARCHITECTURE ]
  1. Input is parsed as URI strictly in-memory using URL parser.
  2. Identified host: `169.254.169.254` (Private IP Space).
  3. Flagged IMMEDIATELY as Private IP evasion attempt.
  4. ZERO OUTBOUND REQUEST IS MADE TO THE TARGET.
  5. Attacker server receives zero pings, logs, or confirmation.
  6. Scanner outputs: "High Risk: Deceptive private IP address detected."
```

---

## 4. Multilingual Regional Pattern Matrix

| Language | Typical Scam Pattern | Engine Detection Technique |
|---|---|---|
| **English** | "Your Netflix subscription failed. Update billing at `netflix-payment.click`" | Brand impersonation heuristic + Domain TLD blacklist |
| **Roman Urdu** | *"Apka Benazir Income Support Program (BISP) 25000 manzoor hogaya rabta karein 0300..."* | Keyword matrix (`bisp`, `manzoor`, `ehsaas`) + Unofficial contact extraction |
| **Urdu (اردو)** | *"آپ کے بینک اکاؤنٹ کو فوری طور پر معطل کیا جا رہا ہے۔ تصدیق کیلئے رابطہ کریں"* | Arabic/Urdu script normalizer + Suspicious urgency classifier |
| **English / Mixed** | "Your HBL online access will be blocked. Enter OTP to keep active." | Sensitive OTP harvesting regex + Financial institution impersonation |
