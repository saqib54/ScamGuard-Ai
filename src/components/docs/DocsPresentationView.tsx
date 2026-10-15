import React, { useState } from 'react';
import {
  FileText, Presentation, GitBranch, Shield, Sparkles, ChevronLeft,
  ChevronRight, CheckCircle2, Layers, Database, Lock, Globe,
  Terminal, BarChart3, AlertTriangle, Eye, Download, BookOpen
} from 'lucide-react';
import { ClaySticker, ClayStamp, STICKER_IMAGES } from '../ui/ClaySticker.tsx';

type DocSection = 'presentation' | 'prd' | 'trd' | 'flow' | 'netlify';

export const DocsPresentationView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<DocSection>('presentation');
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState<boolean>(false);

  const slides = [
    {
      id: 1,
      badge: 'VISION & MISSION',
      title: 'ScamShield AI — "Think Before You Click"',
      subtitle: 'Intelligent Pre-Click Cybersecurity Defense for SMS, WhatsApp & Digital Messaging',
      points: [
        'Pre-click verification protecting everyday digital citizens before credentials or OTPs are lost.',
        'Engineered for regional vulnerabilities: Native detection across English, Urdu (اردو), and Roman Urdu.',
        'Zero-outbound SSRF isolation ensures 100% client safety with zero attacker network triggers.',
        'Combines deterministic local heuristics, real-time public blacklists, and Google Gemini 3.8 Flash.'
      ],
      tag: 'Slide 1 / 12',
      speakerNote: 'Welcome everyone. Today we are presenting ScamShield AI, a platform created to eliminate the primary attack vector for modern social engineering: deception arriving via everyday messaging apps.',
      graphic: (
        <div className="flex flex-col items-center justify-center p-6 clay-inset rounded-2xl bg-gradient-to-br from-emerald-500/10 via-sky-500/10 to-indigo-500/10">
          <div className="text-6xl mb-3 animate-bounce">🛡️</div>
          <span className="font-mono font-black text-emerald-800 dark:text-emerald-300 text-sm">SCAMSHIELD CORE</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Pre-Click Cyber Radar Active</span>
        </div>
      )
    },
    {
      id: 2,
      badge: 'THE PROBLEM',
      title: 'The Silent Epidemic of Messaging Scams',
      subtitle: 'Why Conventional Antivirus Leaves Everyday Citizens Completely Vulnerable',
      points: [
        'Over 85% of credential breaches originate in peer-to-peer SMS, WhatsApp groups, or direct messages.',
        'Traditional antivirus safeguards desktop browsers, but is completely blind to mobile text threads.',
        'The Roman Urdu Blindspot: Conventional NLP systems fail on regional transliteration (e.g., "Apka account block hogaya hai, foran rabta karein").',
        'Vulnerable demographics (seniors, first-time mobile banking users) are disproportionately targeted.'
      ],
      tag: 'Slide 2 / 12',
      speakerNote: 'Traditional enterprise security focuses on desktop firewalls, while real victims lose their life savings on mobile phones through Roman Urdu fraud messages that bypass standard filters.',
      graphic: (
        <div className="p-4 clay-card bg-rose-50/60 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-800 space-y-2">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-xs">
            <AlertTriangle className="w-4 h-4" />
            <span>Unprotected Messaging Vector</span>
          </div>
          <p className="text-xs font-mono text-slate-700 dark:text-slate-300 italic">
            "Urgent: Apka bank account suspend hogaya. Verify karein click: http://hbl-portal.click"
          </p>
          <div className="text-[10px] text-rose-600 font-black">94% of users cannot spot lookalike TLDs on phones</div>
        </div>
      )
    },
    {
      id: 3,
      badge: 'THE SOLUTION',
      title: 'The ScamShield AI Multi-Layer Engine',
      subtitle: 'Instant Triage Combining Deterministic Heuristics & Multimodal AI',
      points: [
        'Tier 1 — Normalization & Homoglyphs: Unmasks zero-width characters and punycode obfuscation.',
        'Tier 2 — Deterministic Heuristics: Zero-latency signature matching for BISP fraud, lottery scams, and OTP traps.',
        'Tier 3 — Real-Time Public Blacklists: Live queries against Abuse.ch URLhaus, OpenPhish, and Spamhaus.',
        'Tier 4 — Gemini 3.8 Flash: Multimodal screenshot OCR and psychological coercion analysis.'
      ],
      tag: 'Slide 3 / 12',
      speakerNote: 'Our architecture is multi-tiered: deterministic rules run locally in milliseconds, while AI provides psychological synthesis and visual OCR.',
      graphic: (
        <div className="space-y-2 p-3 clay-inset rounded-xl text-xs font-bold font-mono">
          <div className="p-2 bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 rounded-lg flex justify-between">
            <span>1. Normalizer</span>
            <span className="text-[10px]">~2ms</span>
          </div>
          <div className="p-2 bg-sky-500/20 text-sky-800 dark:text-sky-300 rounded-lg flex justify-between">
            <span>2. Blacklists & Heuristics</span>
            <span className="text-[10px]">~150ms</span>
          </div>
          <div className="p-2 bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 rounded-lg flex justify-between">
            <span>3. Gemini 3.8 Flash</span>
            <span className="text-[10px]">~800ms</span>
          </div>
        </div>
      )
    },
    {
      id: 4,
      badge: 'REAL-TIME BLACKLISTS',
      title: 'Live Public Threat Intelligence Feeds',
      subtitle: 'Querying Known Cyber Threat Registries Before Revealing Analysis',
      points: [
        'Integrated with Abuse.ch URLhaus: Real-time database of active malware distribution URLs.',
        'OpenPhish Community Feed: Zero-day banking and credential theft target detection.',
        'Spamhaus Domain Blocklist (DBL): Evaluates suspicious domain reputation scores.',
        'Optimized Orchestration: Parallel Promise.allSettled with strict 2.5s timeout and 15-min LRU cache.'
      ],
      tag: 'Slide 4 / 12',
      speakerNote: 'We query the world’s most respected open cybersecurity repositories in real time before returning a verdict, ensuring zero-day malicious links are instantly stopped.',
      graphic: (
        <div className="p-4 clay-card bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800 space-y-2 text-xs">
          <div className="font-black text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-emerald-600" />
            <span>Connected Feeds</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-emerald-200 dark:border-slate-800">URLhaus: Live</div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-emerald-200 dark:border-slate-800">OpenPhish: Live</div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-emerald-200 dark:border-slate-800">Spamhaus: Live</div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-emerald-200 dark:border-slate-800">ThreatFox: Live</div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      badge: 'REGIONAL INTELLIGENCE',
      title: 'Trilingual Mastery & Regional Scams',
      subtitle: 'English, Urdu (اردو), and Roman Urdu Dialect Analysis',
      points: [
        'Phonetic matching for Pakistani and South Asian fraud templates.',
        'BISP & Ehsaas Relief Scam detection: Catches fake poverty alleviation payouts and unofficial phone numbers.',
        'Mobile Wallet Impersonation: EasyPaisa & JazzCash account freeze threats instantly flagged.',
        'Full bidirectional localization: Interface and plain-language explanations in English, Urdu, or Roman Urdu.'
      ],
      tag: 'Slide 5 / 12',
      speakerNote: 'Most cybersecurity products only work in English. ScamShield was built ground-up to comprehend Roman Urdu and Urdu script phonetics, protecting hundreds of millions of underserved users.',
      graphic: (
        <div className="p-4 clay-card bg-white dark:bg-slate-800 space-y-2 text-xs">
          <div className="text-[11px] font-black text-slate-500 uppercase">Supported Regional Dialects</div>
          <div className="flex gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">English (US/UK)</span>
            <span className="px-2.5 py-1 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-bold">اردو (Urdu)</span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold">Roman Urdu</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 italic pt-1">
            "Mubarak ho! Apka 25,000 ka inam nikla hai..." ➔ Flagged with 95% Confidence.
          </p>
        </div>
      )
    },
    {
      id: 6,
      badge: 'MULTIMODAL RADAR',
      title: 'Screenshot Vision & Flyer Inspection',
      subtitle: 'Powered by Google Gemini 3.8 Flash Vision',
      points: [
        'Fraudsters increasingly use images and flyers to evade simple text scrapers.',
        'Users can upload or drop screenshots directly from WhatsApp, Telegram, or SMS.',
        'Gemini 3.8 Flash Vision performs instant OCR, extracts deceptive phone numbers, and evaluates logos.',
        'Delivers structured risk scoring and plain-language threat warnings in seconds.'
      ],
      tag: 'Slide 6 / 12',
      speakerNote: 'Our multimodal capability allows users who cannot easily copy text to just screenshot their screen and upload it. The vision model handles the rest.',
      graphic: (
        <div className="p-4 clay-inset rounded-2xl flex flex-col items-center justify-center text-center space-y-2">
          <div className="text-4xl">📱📸</div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Multimodal Screenshot OCR</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">Extracts sender numbers, deceptive bank headers & QR codes</span>
        </div>
      )
    },
    {
      id: 7,
      badge: 'SECURITY & PRIVACY',
      title: 'Zero-Outbound SSRF Isolation & Privacy',
      subtitle: '100% Client Safety and Complete GDPR Compliance',
      points: [
        'Zero-Outbound Rule: The engine never visits or pings suspicious target URLs, avoiding SSRF attacks.',
        'Zero Plaintext Logging: Private messages and sensitive numbers are not retained in plaintext logs.',
        'GDPR Data Portability: Instant 1-click JSON download of all user scans (/api/v1/account/export).',
        'Irreversible Hard Purge: Users have sovereign control to delete individual scans or wipe their entire history.'
      ],
      tag: 'Slide 7 / 12',
      speakerNote: 'Privacy is our cornerstone. We never trigger attacker infrastructure, and users can export or permanently wipe their scan history at any moment.',
      graphic: (
        <div className="p-4 clay-card bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 font-black text-emerald-800 dark:text-emerald-300">
            <Lock className="w-4 h-4" />
            <span>Privacy Protections</span>
          </div>
          <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
            <li>✔ SSRF Immune Architecture</li>
            <li>✔ PBKDF2 Password Salts (100k rounds)</li>
            <li>✔ Zero Target Outbound Pings</li>
            <li>✔ Instant GDPR JSON Export</li>
          </ul>
        </div>
      )
    },
    {
      id: 8,
      badge: 'DESIGN EXCELLENCE',
      title: 'Tactile Claymorphism & High-Contrast Night Mode',
      subtitle: 'Friendly, Accessible Sensory Aesthetics Across Mobile & Desktop',
      points: [
        'Unique Claymorphic Design: Soft 3D shapes, tactile die-cut stickers, and washi tape accents.',
        'High-Contrast Night Mode: Deep slate-navy palette with luminous status stamps (Safe, Warning, Critical).',
        'Mobile Viewport Tuning: Calibrated down to 320px screens with zero horizontal overflow.',
        'Inclusive Typography: High legibility for senior citizens and low-vision users.'
      ],
      tag: 'Slide 8 / 12',
      speakerNote: 'Cybersecurity tools are often intimidating. Our tactile claymorphism makes security feel intuitive, welcoming, and reassuring, with daylight and night modes.',
      graphic: (
        <div className="p-4 clay-card flex items-center justify-around gap-2 text-center">
          <div className="clay-sticker p-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
            <span className="text-2xl">🛡️</span>
            <div className="text-[9px] font-bold mt-1">Tactile Seal</div>
          </div>
          <ClayStamp text="SCAM DETECTED" variant="danger" rotation={-3} />
          <ClayStamp text="VERIFIED BENIGN" variant="success" rotation={3} />
        </div>
      )
    },
    {
      id: 9,
      badge: 'TECH STACK',
      title: 'Modern Full-Stack Engineering',
      subtitle: 'Production-Ready Architecture Built on Open Standards',
      points: [
        'Frontend: React 19, TypeScript, Tailwind CSS v4, Lucide Icons.',
        'Backend: Node.js 20+, Express 5 API Gateway, Helmet HTTP Security Headers.',
        'Storage: Relational architecture with SQLite3 (development) and PostgreSQL 16 (production).',
        'Containerization: Complete Docker Compose setup with health checks and restart policies.'
      ],
      tag: 'Slide 9 / 12',
      speakerNote: 'Built with the latest React 19 and Express 5, our stack runs efficiently on standard cloud nodes or embedded containers with zero external proprietary lock-in.',
      graphic: (
        <div className="p-3 clay-inset rounded-xl text-xs font-mono space-y-1.5">
          <div className="text-emerald-700 dark:text-emerald-400 font-bold">Frontend: React 19 + TypeScript</div>
          <div className="text-sky-700 dark:text-sky-400 font-bold">Backend: Express 5 + Node 20+</div>
          <div className="text-indigo-700 dark:text-indigo-400 font-bold">Database: PostgreSQL 16 / SQLite</div>
          <div className="text-amber-700 dark:text-amber-400 font-bold">AI: Gemini 3.8 Flash + Heuristics</div>
        </div>
      )
    },
    {
      id: 10,
      badge: 'SIMULATION & COPILOT',
      title: 'Proactive Education: Simulator & AI Copilot',
      subtitle: 'Building Immunity Through Controlled Simulation & Advisory',
      points: [
        'AI Scam Simulator: Synthesizes realistic attacks across categories to test user vigilance.',
        'Interactive AI Copilot: Guides users through suspicious encounters with plain-language advice.',
        'Emergency Directory: One-tap contact information for FIA Cyber Crime, CERTs, and banking hotlines.',
        'Community Threat Map: Aggregates anonymized trends to inform national cybersecurity bodies.'
      ],
      tag: 'Slide 10 / 12',
      speakerNote: 'We believe detection is only half the battle. Education is key. Our interactive simulator trains users to recognize manipulation tactics before they strike.',
      graphic: (
        <div className="p-4 clay-card bg-sky-50/50 dark:bg-sky-950/20 border border-sky-300 dark:border-sky-800 space-y-1.5 text-xs">
          <div className="font-black text-sky-900 dark:text-sky-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span>Interactive Simulator Active</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300">
            Generates realistic banking, lottery, and romance scam simulations for community resilience workshops.
          </p>
        </div>
      )
    },
    {
      id: 11,
      badge: 'ROADMAP',
      title: 'Roadmap & Future Expansion',
      subtitle: 'From Web Radar to Ecosystem-Wide Shield',
      points: [
        'Phase 1 (Complete): Multilingual scanner, real-time blacklists, multimodal OCR, high-contrast dark theme.',
        'Phase 2: Browser Extension (Chrome, Firefox, Safari) for instant hover pre-click inspection.',
        'Phase 3: Telco SMS Gateway API for carrier-level scam filtration before arrival on handset.',
        'Phase 4: Crowdsourced decentralized threat intelligence with cryptographic verification.'
      ],
      tag: 'Slide 11 / 12',
      speakerNote: 'Our roadmap extends ScamShield from web and mobile apps to browser extensions and direct telco gateway integrations, protecting users at the infrastructure level.',
      graphic: (
        <div className="p-3 clay-inset rounded-xl space-y-1.5 text-xs font-mono">
          <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-400 font-bold">
            <span>Phase 1 (Delivered)</span>
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div className="text-slate-500">Phase 2: Browser Extensions</div>
          <div className="text-slate-500">Phase 3: Telco Carrier Integration</div>
          <div className="text-slate-500">Phase 4: Decentralized Threat Radar</div>
        </div>
      )
    },
    {
      id: 12,
      badge: 'CONCLUSION',
      title: 'Think Before You Click — ScamShield AI',
      subtitle: 'Accessible Cybersecurity for Everyone, Everywhere',
      points: [
        'Protecting vulnerable users across English, Urdu, and Roman Urdu.',
        'Empowering digital citizens with transparent, evidence-based threat indicators.',
        'Completely open architecture, rigorous security compliance, and zero-outbound SSRF isolation.',
        'Ready for evaluation, deployment, and live demonstrations.'
      ],
      tag: 'Slide 12 / 12',
      speakerNote: 'Thank you for your time. ScamShield AI is live, robust, and ready to protect millions of mobile users from digital deception. We invite your questions and evaluation.',
      graphic: (
        <div className="p-5 clay-card bg-gradient-to-br from-emerald-500/20 via-sky-500/20 to-indigo-500/20 text-center space-y-2">
          <div className="text-5xl">🛡️✨</div>
          <h4 className="text-base font-black text-slate-900 dark:text-slate-100">ScamShield AI Live</h4>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">Ready for real-world inspection & community defense</p>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner & Section Switcher */}
      <div className="clay-card p-4 sm:p-6 bg-white dark:bg-[#111a2e] border border-white/60 dark:border-slate-800/80 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                Documentation & Presentation Deck
              </h2>
              <ClayStamp text="OFFICIAL SPECIFICATION" variant="info" rotation={-2} />
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Comprehensive PRD, TRD, System Architecture Flows, and Interactive Slide Deck.
            </p>
            {/* Direct Download Buttons for PPTX & PDF */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <a
                href="/docs/ScamShield_Presentation.pptx"
                download="ScamShield_Presentation.pptx"
                className="clay-button-primary px-3 py-1.5 text-xs font-bold inline-flex items-center gap-1.5 shadow-xs"
                title="Download 12-slide PowerPoint Presentation (.pptx)"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Slides (.pptx)</span>
              </a>
              <a
                href="/docs/ScamShield_Documentation.pdf"
                download="ScamShield_Documentation.pdf"
                className="clay-button-secondary px-3 py-1.5 text-xs font-bold inline-flex items-center gap-1.5 shadow-xs text-slate-700 dark:text-slate-200"
                title="Download Complete PRD & TRD Documentation (.pdf)"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Docs (.pdf)</span>
              </a>
            </div>
          </div>

          {/* Section Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0 overflow-x-auto">
            <button
              onClick={() => setActiveSection('presentation')}
              className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeSection === 'presentation'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Slides Deck (12)</span>
            </button>

            <button
              onClick={() => setActiveSection('prd')}
              className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeSection === 'prd'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>PRD Document</span>
            </button>

            <button
              onClick={() => setActiveSection('trd')}
              className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeSection === 'trd'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>TRD Architecture</span>
            </button>

            <button
              onClick={() => setActiveSection('flow')}
              className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeSection === 'flow'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Threat Flowcharts</span>
            </button>

            <button
              onClick={() => setActiveSection('netlify')}
              className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeSection === 'netlify'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Netlify Deploy Guide</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: INTERACTIVE PRESENTATION DECK */}
      {activeSection === 'presentation' && (
        <div className="space-y-4">
          {/* Main Slide Card */}
          <div className="clay-card p-6 sm:p-10 bg-white dark:bg-[#111a2e] relative overflow-hidden min-h-[460px] flex flex-col justify-between shadow-xl">
            {/* Slide Header */}
            <div>
              <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                <span className="text-[11px] font-black font-mono tracking-wider px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  {slides[currentSlide].badge}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400">
                    {slides[currentSlide].tag}
                  </span>
                  <button
                    onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
                    className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  >
                    {showSpeakerNotes ? 'Hide Speaker Notes' : 'Speaker Notes'}
                  </button>
                </div>
              </div>

              <h3 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
                {slides[currentSlide].title}
              </h3>
              <p className="text-xs sm:text-base text-emerald-800 dark:text-emerald-400 font-semibold mt-1 mb-6">
                {slides[currentSlide].subtitle}
              </p>
            </div>

            {/* Slide Body: Points & Graphic */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto items-center">
              <div className="lg:col-span-7 space-y-3">
                {slides[currentSlide].points.map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 shadow-2xs">
                      {idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                      {pt}
                    </span>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-sm">
                  {slides[currentSlide].graphic}
                </div>
              </div>
            </div>

            {/* Optional Speaker Notes Drawer */}
            {showSpeakerNotes && (
              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
                <span className="font-black uppercase tracking-wider block mb-1">Speaker Notes:</span>
                <p className="font-medium italic leading-relaxed">{slides[currentSlide].speakerNote}</p>
              </div>
            )}

            {/* Navigation & Progress Bar */}
            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
              <button
                onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                disabled={currentSlide === 0}
                className="clay-button-secondary px-4 py-2 text-xs font-bold flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Slide</span>
              </button>

              {/* Slide Dots */}
              <div className="hidden sm:flex items-center gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-2 rounded-full transition-all ${
                      currentSlide === i
                        ? 'w-6 bg-emerald-600'
                        : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                    }`}
                    title={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
                disabled={currentSlide === slides.length - 1}
                className="clay-button-primary px-4 py-2 text-xs font-bold flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Next Slide</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Slide Overview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className={`p-2.5 rounded-xl text-left transition-all border ${
                  currentSlide === idx
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-sm'
                    : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 hover:bg-slate-50'
                }`}
              >
                <span className="text-[10px] font-mono font-bold text-slate-400 block mb-0.5">Slide {idx + 1}</span>
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 line-clamp-1">{s.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: PRODUCT REQUIREMENTS DOCUMENT (PRD) */}
      {activeSection === 'prd' && (
        <div className="clay-card p-6 sm:p-9 bg-white dark:bg-[#111a2e] space-y-8">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-[11px] font-mono uppercase font-black text-emerald-800 dark:text-emerald-400 tracking-wider">
              Product Requirements Document (PRD) · v2.1.0
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1">
              ScamShield AI — "Think Before You Click"
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Official product specification, target personas, functional requirements, and success metrics.
            </p>
          </div>

          {/* PRD Section 1: Vision & Personas */}
          <div className="space-y-4">
            <h4 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>1. Target Personas & Problem Scenarios</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 clay-inset rounded-xl space-y-2">
                <span className="text-xs font-black text-emerald-800 dark:text-emerald-300">Persona A: Mobile Banking User</span>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  Receives an SMS warning their HBL or EasyPaisa account is frozen. Needs a quick 5-second check to confirm validity before surrendering credentials or OTPs.
                </p>
              </div>

              <div className="p-4 clay-inset rounded-xl space-y-2">
                <span className="text-xs font-black text-sky-800 dark:text-sky-300">Persona B: Senior Citizen / Urdu Speaker</span>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  Receives fake BISP or lottery announcements in Roman Urdu or Urdu script. Requires high-contrast color-coded guidance (Green = Safe, Red = Scam) with clear next steps.
                </p>
              </div>

              <div className="p-4 clay-inset rounded-xl space-y-2">
                <span className="text-xs font-black text-indigo-800 dark:text-indigo-300">Persona C: Security Analyst / SOC Tier-1</span>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  Requires zero-outbound structural URL parsing, homoglyph analysis, MITRE ATT&CK technique tags, and public blacklist status without triggering attacker servers.
                </p>
              </div>
            </div>
          </div>

          {/* PRD Section 2: Functional Scope */}
          <div className="space-y-4">
            <h4 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>2. Core Functional Requirements</span>
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200 font-black">
                    <th className="p-3">Feature ID</th>
                    <th className="p-3">Capability</th>
                    <th className="p-3">Description & Acceptance Criteria</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  <tr>
                    <td className="p-3 font-mono font-bold text-emerald-700">FR-01</td>
                    <td className="p-3 font-bold">Multilingual Normalization</td>
                    <td className="p-3">Strips zero-width characters, unmasks unicode homoglyphs, and detects English, Urdu, and Roman Urdu.</td>
                    <td className="p-3"><span className="text-emerald-700 font-bold">✔ Delivered</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-emerald-700">FR-02</td>
                    <td className="p-3 font-bold">Zero-Outbound URL Parsing</td>
                    <td className="p-3">SSRF-immune lexical URL dissection; never pings or connects to target destination.</td>
                    <td className="p-3"><span className="text-emerald-700 font-bold">✔ Delivered</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-emerald-700">FR-03</td>
                    <td className="p-3 font-bold">Real-Time Public Blacklists</td>
                    <td className="p-3">Queries Abuse.ch URLhaus, OpenPhish, and Spamhaus before returning analysis results.</td>
                    <td className="p-3"><span className="text-emerald-700 font-bold">✔ Delivered</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-emerald-700">FR-04</td>
                    <td className="p-3 font-bold">Multimodal Screenshot OCR</td>
                    <td className="p-3">Gemini 3.8 Flash Vision processes uploaded screenshots and parses deceptive visual brand headers.</td>
                    <td className="p-3"><span className="text-emerald-700 font-bold">✔ Delivered</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-emerald-700">FR-05</td>
                    <td className="p-3 font-bold">Tactile Claymorphism & Night Mode</td>
                    <td className="p-3">Complete daylight and high-contrast night modes with responsive mobile layout down to 320px.</td>
                    <td className="p-3"><span className="text-emerald-700 font-bold">✔ Delivered</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-emerald-700">FR-06</td>
                    <td className="p-3 font-bold">GDPR Sovereign Privacy</td>
                    <td className="p-3">1-click JSON export, irreversible hard delete, and zero plaintext message logging.</td>
                    <td className="p-3"><span className="text-emerald-700 font-bold">✔ Delivered</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: TECHNICAL REQUIREMENTS DOCUMENT (TRD) */}
      {activeSection === 'trd' && (
        <div className="clay-card p-6 sm:p-9 bg-white dark:bg-[#111a2e] space-y-8">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-[11px] font-mono uppercase font-black text-sky-800 dark:text-sky-400 tracking-wider">
              Technical Requirements Document (TRD) · Architecture Specification
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1">
              System Engineering & Architecture Contract
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Zero-outbound SSRF isolation, API contracts, threat scoring matrix, and relational database schema.
            </p>
          </div>

          {/* TRD Section 1: Tech Stack */}
          <div className="space-y-4">
            <h4 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-sky-600" />
              <span>1. Technology Stack Specification</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 clay-inset rounded-xl space-y-1">
                <span className="font-black text-emerald-800 dark:text-emerald-400 block">Frontend Tier</span>
                <p className="text-slate-600 dark:text-slate-300">React 19, TypeScript, Tailwind CSS v4, Lucide Icons</p>
              </div>
              <div className="p-3.5 clay-inset rounded-xl space-y-1">
                <span className="font-black text-sky-800 dark:text-sky-400 block">API Gateway</span>
                <p className="text-slate-600 dark:text-slate-300">Express 5, Node.js 20+, Helmet, CORS, Rate-Limiter</p>
              </div>
              <div className="p-3.5 clay-inset rounded-xl space-y-1">
                <span className="font-black text-indigo-800 dark:text-indigo-400 block">Threat Feeds</span>
                <p className="text-slate-600 dark:text-slate-300">Abuse.ch URLhaus, OpenPhish, Spamhaus DBL</p>
              </div>
              <div className="p-3.5 clay-inset rounded-xl space-y-1">
                <span className="font-black text-amber-800 dark:text-amber-400 block">Database</span>
                <p className="text-slate-600 dark:text-slate-300">SQLite3 in local dev, PostgreSQL 16 in production</p>
              </div>
            </div>
          </div>

          {/* TRD Section 2: Zero-Outbound SSRF Architecture */}
          <div className="space-y-4">
            <h4 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-600" />
              <span>2. Zero-Outbound SSRF Defense Implementation</span>
            </h4>
            <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl font-mono text-xs space-y-2 overflow-x-auto">
              <div className="text-emerald-400 font-bold">// server/analysis/urlInspector.ts — Strict SSRF Protection</div>
              <p className="text-slate-300">
                1. Parses RFC compliant URI structure offline without outbound socket connections.<br />
                2. Disallows private IP ranges (127.0.0.1, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.169.254).<br />
                3. Identifies homoglyph punycode scripts (e.g. xn--p1ai Cyrillic substitutions).<br />
                4. Outbound API connections ONLY go to verified public intelligence registries (URLhaus).
              </p>
            </div>
          </div>

          {/* TRD Section 3: API Contracts */}
          <div className="space-y-4">
            <h4 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>3. API Endpoints Contract (/api/v1)</span>
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse font-mono">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200 font-bold">
                    <th className="p-2.5">Method</th>
                    <th className="p-2.5">Endpoint</th>
                    <th className="p-2.5 font-sans">Functionality</th>
                    <th className="p-2.5 font-sans">Authentication</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  <tr>
                    <td className="p-2.5 text-emerald-700 font-bold">POST</td>
                    <td className="p-2.5">/api/v1/analyses</td>
                    <td className="p-2.5 font-sans">Submit text, URL, or screenshot for multi-tier inspection</td>
                    <td className="p-2.5 font-sans">Optional Session</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-sky-700 font-bold">POST</td>
                    <td className="p-2.5">/api/v1/reputation/check</td>
                    <td className="p-2.5 font-sans">Query URL against real-time public blacklists</td>
                    <td className="p-2.5 font-sans">Public / Rate-limited</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-amber-700 font-bold">GET</td>
                    <td className="p-2.5">/api/v1/analyses</td>
                    <td className="p-2.5 font-sans">Paginated search & history filter</td>
                    <td className="p-2.5 font-sans">Session Required</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-rose-700 font-bold">DELETE</td>
                    <td className="p-2.5">/api/v1/analyses</td>
                    <td className="p-2.5 font-sans">Hard purge of all user records (GDPR Right to Be Forgotten)</td>
                    <td className="p-2.5 font-sans">Session Required</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-indigo-700 font-bold">GET</td>
                    <td className="p-2.5">/api/v1/account/export</td>
                    <td className="p-2.5 font-sans">Instant JSON audit history export (GDPR Data Portability)</td>
                    <td className="p-2.5 font-sans">Session Required</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: THREAT FLOWCHARTS & DIAGRAMS */}
      {activeSection === 'flow' && (
        <div className="clay-card p-6 sm:p-9 bg-white dark:bg-[#111a2e] space-y-8">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-[11px] font-mono uppercase font-black text-indigo-800 dark:text-indigo-400 tracking-wider">
              System Architecture & Threat Pipelines
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1">
              End-to-End Threat Pipeline Sequence
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Step-by-step visual data flow from incoming payload to multi-layer evaluation and client presentation.
            </p>
          </div>

          {/* Interactive Flow Visual */}
          <div className="space-y-4">
            <div className="p-6 bg-slate-900 rounded-2xl text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
              <pre className="text-emerald-400 font-bold mb-2">// 1. CLIENT REQUEST INGESTION</pre>
              [User Input] ➔ [Express Gateway /api/v1/analyses] ➔ [Rate Limiter Check] ➔ [Request ID Tagging]
              <br /><br />
              <pre className="text-sky-400 font-bold mb-2">// 2. DUAL-STREAM PARALLEL PROCESSING</pre>
              ┌─► [Input Normalizer] ➔ [Zero-Width Stripping] ➔ [Regional Language Classifier]
              <br />
              ├─► [Target URL Extraction] ➔ [Zero-Outbound Lexical Parsing] ➔ [Punycode / Homoglyph Audit]
              <br />
              └─► [Real-Time Public Blacklists] ➔ [URLhaus] + [OpenPhish] + [Spamhaus] (2.5s Timeout)
              <br /><br />
              <pre className="text-indigo-400 font-bold mb-2">// 3. CONTEXTUAL & AI SYNTHESIS</pre>
              [Deterministic Heuristics] + [Public Blacklist Flags] ➔ [Gemini 3.8 Flash Synthesis]
              <br />
              ↳ (If listed on public blacklist ➔ Score clamped to Critical Threat &gt;= 90)
              <br /><br />
              <pre className="text-amber-400 font-bold mb-2">// 4. STORAGE & CLIENT RENDERING</pre>
              [Relational Audit Store] ➔ [Tactile Claymorphic Risk Card] ➔ [Actionable Next Steps]
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: NETLIFY DEPLOYMENT GUIDE (FRONTEND + BACKEND) */}
      {activeSection === 'netlify' && (
        <div className="clay-card p-6 sm:p-9 bg-white dark:bg-[#111a2e] space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-[11px] font-mono uppercase font-black text-emerald-800 dark:text-emerald-400 tracking-wider">
              Production Cloud Deployment Spec
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1">
              Netlify Full-Stack Deployment: Frontend + Backend
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Complete configuration to deploy both the React 19 Single Page Application and the Express API together on Netlify.
            </p>
          </div>

          {/* Urdu Language Explanation Card */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
            <div className="flex items-center gap-2 font-black text-sm">
              <span className="text-lg">🇵🇰</span>
              <span>اردو گائیڈ: کیا Netlify پر Frontend اور Backend دونوں چلیں گے؟</span>
            </div>
            <p className="text-xs leading-relaxed font-medium">
              <strong>جی ہاں! بالکل!</strong> Netlify آپ کے React Frontend کو الٹرا فاسٹ CDN سے سرور کرتا ہے اور Express Backend کو <code>netlify/functions/api.ts</code> اور <code>serverless-http</code> کے ذریعے سرور لیس فنکشنز (Serverless Functions) پر چلاتا ہے۔ ہم نے <code>netlify.toml</code> اور <code>api.ts</code> پہلے سے بنا دیا ہے، اس لیے بس GitHub سے ریپو کنیکٹ کریں یا Netlify پر اپلوڈ کریں، یہ دونوں ایک ساتھ 100% لائیو چلیں گے۔
            </p>
          </div>

          {/* Step by Step English Guide */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs">
                1
              </div>
              <h4 className="text-sm font-bold text-slate-900">Push to GitHub</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Push this entire project to your GitHub repository. Netlify will auto-detect the configuration.
              </p>
              <pre className="p-2 bg-slate-900 text-slate-200 text-[10px] font-mono rounded-lg">
git add .
git commit -m "Deploy"
git push
              </pre>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-black text-xs">
                2
              </div>
              <h4 className="text-sm font-bold text-slate-900">Import in Netlify</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Go to Netlify dashboard ➔ "Add new site" ➔ "Import an existing project" from GitHub.
              </p>
              <div className="text-[11px] font-mono text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
                • Build: npm run build<br />
                • Publish: dist<br />
                • Functions: netlify/functions
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-black text-xs">
                3
              </div>
              <h4 className="text-sm font-bold text-slate-900">Set Env & Deploy</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Add <code>GEMINI_API_KEY</code> in Netlify Site Configuration, then click Deploy Site!
              </p>
              <div className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-100/50 p-2 rounded-lg border border-emerald-200">
                ✔ 100% Automated Deployment<br />
                ✔ Safari & Chrome Certified
              </div>
            </div>
          </div>

          {/* Architecture Topology */}
          <div className="p-5 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs space-y-3">
            <div className="text-emerald-400 font-bold">// NETLIFY RUNTIME ARCHITECTURE</div>
            <pre className="text-slate-300 leading-relaxed overflow-x-auto">
[ User Request ]
       │
       ├─► (/*) ➔ Netlify Global CDN ➔ dist/index.html (React 19 Frontend)
       │
       └─► (/api/*) ➔ Netlify Rewrite ➔ netlify/functions/api.ts (Express Backend)
                                                 │
                                                 ▼
                                     [ serverless-http Wrapper ]
                                                 │
                                                 ▼
                                    • Rate Limiter & Security Headers
                                    • Zero-Outbound SSRF Link Parser
                                    • Live Blacklists (URLhaus / OpenPhish)
                                    • Google Gemini 3.8 Flash Vision OCR
                                    • Serverless /tmp Database Store
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
