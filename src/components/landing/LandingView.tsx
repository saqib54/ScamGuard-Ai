import React, { useState } from 'react';
import {
  Shield, ShieldCheck, AlertOctagon, PhoneCall, MessageSquare, Mail, Globe,
  ArrowRight, CheckCircle2, Lock, EyeOff, Server, HelpCircle, BrainCircuit,
  Sparkles, Camera, Award, FileCheck, ExternalLink, Zap
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { ClaySticker, ClayStamp, STICKER_IMAGES } from '../ui/ClaySticker.tsx';

interface LandingViewProps {
  onStartScanning: () => void;
  onSelectSample: (text: string, type: 'sms' | 'whatsapp' | 'email' | 'url') => void;
  onOpenSimulator?: () => void;
  onOpenCopilot?: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onStartScanning,
  onSelectSample,
  onOpenSimulator,
  onOpenCopilot
}) => {
  const { t } = useLanguage();
  const [activeStickerInfo, setActiveStickerInfo] = useState<string | null>(null);

  const featureCards = [
    {
      icon: Camera,
      title: 'Multimodal Vision OCR',
      desc: 'Upload or paste WhatsApp & SMS screenshots. Gemini 3.8 Flash extracts text and flags fake stamps & imitation logos.',
      sticker: STICKER_IMAGES.scannerPhone,
      stickerAlt: 'Clay Phone Scanner',
      tag: 'NEW AI VISION'
    },
    {
      icon: Sparkles,
      title: '24/7 AI Incident Copilot',
      desc: 'Panicking after clicking a link? Instant triage, containment steps, and FIA CCW reporting guidance.',
      sticker: STICKER_IMAGES.aiRobotDetective,
      stickerAlt: 'Clay AI Detective Robot',
      tag: 'GEMINI 3.8'
    },
    {
      icon: PhoneCall,
      title: 'Anti-Phishing & Smishing',
      desc: 'Identifies fake BISP grants, lottery traps, and mobile wallet OTP theft in English, Urdu, and Roman Urdu.',
      sticker: STICKER_IMAGES.phishingBlocked,
      stickerAlt: 'Clay Hook Blocked Sticker',
      tag: 'HEURISTIC + AI'
    },
    {
      icon: ShieldCheck,
      title: 'Certified Trust Verification',
      desc: 'Zero-outbound SSRF isolation. Every URL is structurally dissected without ever pinging the attacker server.',
      sticker: STICKER_IMAGES.securitySeal,
      stickerAlt: 'Clay Verified Seal',
      tag: '100% PRIVATE'
    }
  ];

  const sampleReports = [
    {
      type: 'whatsapp' as const,
      lang: 'Roman Urdu',
      title: 'BISP Fake Disbursement Bait',
      text: 'Apka Benazir Income Support Program (BISP) 25,000 rupay manzoor ho gaya hai. Abhi rabta karein 0301-XXXXXXX',
      score: 92,
      level: 'Critical Fraud',
      stamp: 'SCAM DETECTED',
      stampVariant: 'danger' as const,
      indicators: ['Relief fund impersonation', 'Unofficial personal contact number']
    },
    {
      type: 'sms' as const,
      lang: 'English',
      title: 'Banking Credential Phishing',
      text: 'URGENT: Your HBL online banking access will be suspended within 2 hours. Click http://hbl-security-portal.online to verify your CNIC and OTP.',
      score: 96,
      level: 'Critical Threat',
      stamp: 'PHISHING HOOK',
      stampVariant: 'danger' as const,
      indicators: ['OTP harvesting', 'Artificial urgency threat', 'Lookalike domain (.online)']
    },
    {
      type: 'sms' as const,
      lang: 'English',
      title: 'Benign Automated Transaction OTP',
      text: 'Your verification code is 492810. Valid for 5 minutes. Do not share this code with anyone, including bank representatives.',
      score: 12,
      level: 'Low Risk',
      stamp: 'VERIFIED BENIGN',
      stampVariant: 'success' as const,
      indicators: ['Standard transactional pattern', 'No solicitations or deceptive links']
    }
  ];

  const faqs = [
    {
      q: 'Does ScamShield AI guarantee that a low-risk message is 100% safe?',
      a: 'No. Cyber threats evolve continuously. ScamShield AI provides transparent, evidence-based risk indicators and heuristics, but never claims absolute safety. Always verify critical requests directly through official authenticated channels.'
    },
    {
      q: 'Does the scanner visit or click on the links I submit?',
      a: 'Never. ScamShield AI enforces strict zero-outbound SSRF isolation. Submitted URLs are inspected structurally and lexically on the server (checking hostnames, punycode homoglyphs, IP addresses, and brand patterns) without ever making outbound web requests.'
    },
    {
      q: 'How does ScamShield handle Urdu and Roman Urdu?',
      a: 'Our engine incorporates multilingual normalization and phonetic pattern matching calibrated specifically for regional fraud markers across Pakistan and South Asia, including BISP relief scams, lottery claims, and mobile wallet impersonations.'
    },
    {
      q: 'Are my private messages logged or sold?',
      a: 'Never. Messages are analyzed in-memory. Only sanitized cryptographic hashes and summarized indicators are retained according to your configured retention settings. You can purge your entire history at any time.'
    }
  ];

  return (
    <div className="space-y-16 py-4">
      {/* Hero Showcase with Realistic 3D Clay Presentation & Floating Stickers */}
      <section className="clay-card p-6 sm:p-12 relative overflow-hidden">
        {/* Ambient decorative clay orbs in background */}
        <div className="absolute -top-10 -right-10 w-40 h-40 clay-orb bg-linear-to-br from-emerald-100/60 to-teal-50/20 blur-xs pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 clay-orb bg-linear-to-tr from-sky-100/60 to-indigo-50/20 blur-xs pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-1">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <div className="clay-sticker-tag bg-white text-emerald-900">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Multilingual: English · اردو · Roman Urdu</span>
              </div>
              <span className="clay-sticker-tag bg-sky-50 text-sky-800 border-white">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>Gemini 3.8 AI Inside</span>
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
              Think Before You Click.
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium max-w-xl">
              Inspect suspicious SMS messages, WhatsApp chats, phishing emails, and screenshots before fraud strikes. Get evidence-backed risk scores, regional scam deconstruction, and instant safety steps.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onStartScanning}
                className="clay-button-primary inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-black"
              >
                <span>Scan Message or Screenshot</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {onOpenCopilot && (
                <button
                  onClick={onOpenCopilot}
                  className="clay-button-accent inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-extrabold text-sky-900"
                >
                  <Sparkles className="w-4 h-4 text-sky-700" />
                  <span>AI Incident Advisor</span>
                </button>
              )}

              {onOpenSimulator && (
                <button
                  onClick={onOpenSimulator}
                  className="clay-button-secondary inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-extrabold text-slate-800"
                >
                  <BrainCircuit className="w-4 h-4 text-emerald-800" />
                  <span>Threat Simulator</span>
                </button>
              )}
            </div>

            {/* Rubber Stamp Certifications */}
            <div className="pt-4 flex flex-wrap items-center gap-3 border-t border-slate-200/60">
              <ClayStamp text="FIA CCW 1991 READY" variant="success" rotation={-2} />
              <ClayStamp text="ZERO SSRF PRIVATE" variant="info" rotation={2} />
              <ClayStamp text="GEMINI MULTIMODAL" variant="warning" rotation={-1} />
            </div>
          </div>

          {/* Right Hero Column: 3D Clay Scene with Realistic Die-Cut Stickers */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
            {/* Main Clay Hero Mascot Frame */}
            <div className="relative clay-card p-3 sm:p-4 bg-white/95 w-full max-w-md mx-auto shadow-2xl">
              {/* Tape strip on top */}
              <div className="clay-tape -top-3 left-1/2 -translate-x-1/2 -rotate-2 rounded-xs" />

              <div className="relative overflow-hidden rounded-2xl bg-slate-900/5 clay-gloss-sheen">
                <img
                  src={STICKER_IMAGES.heroShield}
                  alt="ScamShield 3D Clay Cyber Mascot"
                  referrerPolicy="no-referrer"
                  className="w-full h-64 sm:h-72 object-cover object-center rounded-2xl transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute bottom-2 left-2 right-2 p-2 bg-white/90 backdrop-blur-xs rounded-xl border border-white flex items-center justify-between text-[11px] font-bold text-slate-800 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>ScamShield Guardian Active</span>
                  </div>
                  <span className="text-emerald-800 font-mono">100% Client-Safe</span>
                </div>
              </div>

              {/* Floating Die-Cut Sticker: Phishing Blocked Hook */}
              <div className="absolute -top-6 -left-6 hidden sm:block">
                <ClaySticker
                  imageSrc={STICKER_IMAGES.phishingBlocked}
                  alt="Phishing Blocked 3D Clay Sticker"
                  size="md"
                  rotation={-8}
                  badgeText="BLOCKED"
                  tapeTop
                />
              </div>

              {/* Floating Die-Cut Sticker: Verified Seal */}
              <div className="absolute -bottom-6 -right-6 hidden sm:block">
                <ClaySticker
                  imageSrc={STICKER_IMAGES.securitySeal}
                  alt="Verified Security Seal 3D Clay Sticker"
                  size="md"
                  rotation={6}
                  badgeText="VERIFIED"
                />
              </div>
            </div>

            {/* Mobile stickers row */}
            <div className="flex sm:hidden items-center justify-center gap-3 mt-4">
              <ClaySticker
                imageSrc={STICKER_IMAGES.phishingBlocked}
                alt="Phishing Blocked 3D Clay Sticker"
                size="sm"
                rotation={-5}
                badgeText="BLOCKED"
              />
              <ClaySticker
                imageSrc={STICKER_IMAGES.securitySeal}
                alt="Verified Security Seal 3D Clay Sticker"
                size="sm"
                rotation={5}
                badgeText="VERIFIED"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive 3D Clay Stickers & Badges Showcase */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-800 mb-1">
              <Award className="w-4 h-4 text-emerald-700" />
              <span>Cybersecurity Sticker Badges</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Tactile Security Defense Badges
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Click any 3D sticker below to inspect its cybersecurity role and protection layer.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div
            onClick={() => setActiveStickerInfo('aiRobot')}
            className={`p-4 clay-card-interactive cursor-pointer flex flex-col items-center text-center space-y-3 ${
              activeStickerInfo === 'aiRobot' ? 'ring-2 ring-emerald-500 bg-emerald-50/30' : ''
            }`}
          >
            <ClaySticker
              imageSrc={STICKER_IMAGES.aiRobotDetective}
              alt="AI Detective Robot Sticker"
              size="sm"
              rotation={-3}
            />
            <div>
              <h4 className="text-xs font-black text-slate-900">AI Detective Copilot</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">24/7 Incident containment</p>
            </div>
          </div>

          <div
            onClick={() => setActiveStickerInfo('phishingHook')}
            className={`p-4 clay-card-interactive cursor-pointer flex flex-col items-center text-center space-y-3 ${
              activeStickerInfo === 'phishingHook' ? 'ring-2 ring-emerald-500 bg-emerald-50/30' : ''
            }`}
          >
            <ClaySticker
              imageSrc={STICKER_IMAGES.phishingBlocked}
              alt="Phishing Hook Blocked Sticker"
              size="sm"
              rotation={4}
            />
            <div>
              <h4 className="text-xs font-black text-slate-900">Phishing Hook Breaker</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Blocks lookalike domains</p>
            </div>
          </div>

          <div
            onClick={() => setActiveStickerInfo('securitySeal')}
            className={`p-4 clay-card-interactive cursor-pointer flex flex-col items-center text-center space-y-3 ${
              activeStickerInfo === 'securitySeal' ? 'ring-2 ring-emerald-500 bg-emerald-50/30' : ''
            }`}
          >
            <ClaySticker
              imageSrc={STICKER_IMAGES.securitySeal}
              alt="Security Seal Badge"
              size="sm"
              rotation={-2}
            />
            <div>
              <h4 className="text-xs font-black text-slate-900">Verified Safety Seal</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Authentic OTP pattern check</p>
            </div>
          </div>

          <div
            onClick={() => setActiveStickerInfo('scannerPhone')}
            className={`p-4 clay-card-interactive cursor-pointer flex flex-col items-center text-center space-y-3 ${
              activeStickerInfo === 'scannerPhone' ? 'ring-2 ring-emerald-500 bg-emerald-50/30' : ''
            }`}
          >
            <ClaySticker
              imageSrc={STICKER_IMAGES.scannerPhone}
              alt="Screenshot Radar Phone"
              size="sm"
              rotation={3}
            />
            <div>
              <h4 className="text-xs font-black text-slate-900">Multimodal OCR Radar</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Scans chat screenshots</p>
            </div>
          </div>
        </div>

        {/* Sticker Info Popover Drawer */}
        {activeStickerInfo && (
          <div className="p-4 clay-card bg-emerald-50/80 border border-emerald-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <span className="font-black text-emerald-900 block">
                  {activeStickerInfo === 'aiRobot' && 'AI Detective: Real-time psychological & forensic guidance'}
                  {activeStickerInfo === 'phishingHook' && 'Phishing Defense: Dissects homoglyphs, brand squatting, and punycode'}
                  {activeStickerInfo === 'securitySeal' && 'Safety Seal: Validates legitimate bank dispatch tokens and zero solicitations'}
                  {activeStickerInfo === 'scannerPhone' && 'Multimodal Radar: Analyzes screenshots with Gemini 3.8 Flash Vision'}
                </span>
                <span className="text-slate-600">
                  Ready to test with your own suspicious message or screenshot?
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onStartScanning}
                className="clay-button-primary px-4 py-2 text-xs font-bold"
              >
                Scan Now
              </button>
              <button
                onClick={() => setActiveStickerInfo(null)}
                className="text-slate-400 hover:text-slate-700 font-bold px-2 py-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Feature Capabilities in Tactile Clay Bento Cards with Real Images */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {featureCards.map((f, i) => {
          const Icon = f.icon;
          return (
            <div
              key={i}
              className="p-6 clay-card-interactive flex flex-col justify-between space-y-4 group relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shadow-xs border border-white">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-white">
                    {f.tag}
                  </span>
                </div>
                <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-900 transition-colors">
                  {f.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {f.desc}
                </p>
              </div>

              {/* Realistic Clay Sticker Thumbnail Preview */}
              <div className="pt-2 flex justify-end">
                <div className="clay-sticker p-1.5 w-16 h-16 rounded-2xl transition-transform group-hover:scale-110 group-hover:-rotate-3">
                  <img
                    src={f.sticker}
                    alt={f.stickerAlt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* How it Works Pipeline */}
      <section id="how-it-works" className="clay-card p-6 sm:p-9 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <span className="text-[11px] font-mono uppercase font-black text-emerald-800 tracking-wider">
            Automated Inspection Engine
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            Multi-Layer Threat Inspection Pipeline
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Every submission is vetted through structured cybersecurity heuristics and Gemini AI reasoning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-5 clay-inset space-y-2">
            <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase block">Step 1</span>
            <h4 className="text-xs font-black text-slate-900">Input Normalization & Homoglyphs</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Decodes deceptive zero-width unicode characters, isolates lookalike alphabets, and detects English, Urdu, or Roman Urdu markers.
            </p>
          </div>

          <div className="p-5 clay-inset space-y-2">
            <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase block">Step 2</span>
            <h4 className="text-xs font-black text-slate-900">Zero-Outbound URL Analysis</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Checks domain structure, deceptive subdomains, private IP ranges (SSRF defense), and brand squatting without making outbound connections.
            </p>
          </div>

          <div className="p-5 clay-inset space-y-2">
            <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase block">Step 3</span>
            <h4 className="text-xs font-black text-slate-900">Hybrid Heuristic & AI Synthesis</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cross-references known social engineering patterns, assigns transparent 0–100 risk scores, and outputs actionable safe steps.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Sample Analyses Showcase with Rubber Stamps */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Interactive Sample Analyses
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Click any sample below to load it into the scanner and inspect full security telemetry.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {sampleReports.map((s, idx) => (
            <div
              key={idx}
              onClick={() => onSelectSample(s.text, s.type)}
              className="p-6 clay-card-interactive cursor-pointer space-y-3.5 flex flex-col justify-between relative group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-lg font-bold border border-white">
                    {s.lang}
                  </span>
                  <span
                    className={`text-xs font-mono font-black px-2.5 py-0.5 rounded-lg ${
                      s.score >= 80 ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {s.score}/100
                  </span>
                </div>
                <h4 className="text-xs font-black text-slate-900">{s.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-3 font-mono p-3 clay-inset">
                  "{s.text}"
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <ClayStamp text={s.stamp} variant={s.stampVariant} rotation={idx % 2 === 0 ? -3 : 2} />
                  <span className="text-[11px] font-black text-emerald-800 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div className="space-y-1 pt-1 border-t border-slate-100">
                  {s.indicators.map((ind, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                      <span className="truncate">{ind}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Safety Education & FAQs in Clay Inset Accordion */}
      <section className="clay-card p-6 sm:p-9 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-[11px] font-mono uppercase font-black text-emerald-800 tracking-wider">
            Clear Transparency
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            Security Principles & FAQ
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {faqs.map((f, i) => (
            <div key={i} className="p-5 clay-inset space-y-2">
              <h4 className="text-xs font-black text-slate-900 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>{f.q}</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed pl-6 font-medium">
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
