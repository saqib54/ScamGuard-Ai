import React, { useState } from 'react';
import {
  ShieldAlert, Sparkles, Send, PhoneCall, AlertTriangle, CheckCircle2,
  HelpCircle, ArrowRight, LifeBuoy, ExternalLink, RefreshCw, UserX, Lock
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useToast } from '../ui/Toast.tsx';
import { ClaySticker, ClayStamp, STICKER_IMAGES } from '../ui/ClaySticker.tsx';

interface CopilotResponse {
  summary: string;
  urgencyLevel: 'immediate' | 'high' | 'precautionary' | string;
  immediateActions: string[];
  helplines: Array<{
    entity: string;
    phone: string;
    website?: string;
    note: string;
  }>;
  practicalAdvice: string;
}

export const AiCopilotView: React.FC = () => {
  const { t } = useLanguage();
  const { showToast } = useToast();

  const [question, setQuestion] = useState<string>('');
  const [selectedScenario, setSelectedScenario] = useState<string>('clicked_link');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<CopilotResponse | null>(null);

  const quickScenarios = [
    {
      id: 'clicked_link',
      label: 'Clicked Phishing Link',
      query: 'I accidentally clicked a suspicious link from an SMS claiming my bank account is locked. What should I do immediately?'
    },
    {
      id: 'shared_otp',
      label: 'Shared OTP / PIN',
      query: 'I gave my 6-digit verification code to a caller claiming to be an EasyPaisa / Bank customer officer. How do I stop unauthorized transactions?'
    },
    {
      id: 'bisp_scam',
      label: 'Fake BISP / Grant Call',
      query: 'Received a WhatsApp call from an unknown 0300 number saying Rs. 25,000 BISP grant was approved, but asking for Rs. 1,500 registration fee. Is this real?'
    },
    {
      id: 'report_fia',
      label: 'Report to FIA / PTA',
      query: 'How do I officially lodge an FIR or cybercrime complaint with FIA Cyber Crime Wing and PTA helpline 1991 against a scammer?'
    }
  ];

  const handleSendQuestion = async (customQuery?: string) => {
    const textToSend = customQuery || question;
    if (!textToSend.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend.trim(),
          incidentType: selectedScenario,
          language: 'en'
        })
      });

      if (!res.ok) {
        throw new Error('Failed to consult AI Cyber Guardian.');
      }

      const data = await res.json();
      setResponse(data);
      showToast('Cyber Guardian triage report generated.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error consulting AI Guardian.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectQuickPrompt = (prompt: typeof quickScenarios[0]) => {
    setSelectedScenario(prompt.id);
    setQuestion(prompt.query);
    handleSendQuestion(prompt.query);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner with Tactile Clay Robot Detective */}
      <div className="clay-card p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-sky-900 rounded-full text-xs font-black shadow-xs border border-white">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>24/7 AI Cybersecurity Guardian & Incident Triage</span>
            </div>
            <ClayStamp text="FIA CCW 1991" variant="success" rotation={-2} />
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            Emergency Incident Advisor
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl font-medium">
            In distress or unsure about a suspicious message? Get immediate step-by-step containment instructions, official reporting contacts, and fraud mitigation advice powered by Gemini 3.8 Flash.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="p-3 bg-emerald-50 rounded-2xl border border-white shadow-xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
                <LifeBuoy className="w-4 h-4 text-emerald-100" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                  National Helpline
                </span>
                <span className="text-sm font-black text-slate-900 font-mono">
                  FIA CCW: 1991
                </span>
              </div>
            </div>
            <div className="p-3 bg-sky-50 rounded-2xl border border-white shadow-xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-700 text-white flex items-center justify-center">
                <PhoneCall className="w-4 h-4 text-sky-100" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-sky-800 block">
                  PTA Anti-Spam
                </span>
                <span className="text-sm font-black text-slate-900 font-mono">
                  SMS 9000
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3D Clay Detective Robot Sticker Mascot */}
        <div className="shrink-0 flex items-center justify-center">
          <ClaySticker
            imageSrc={STICKER_IMAGES.aiRobotDetective}
            alt="AI Cyber Detective Robot"
            size="md"
            rotation={3}
            badgeText="AI COPILOT"
            tapeTop
          />
        </div>
      </div>

      {/* Quick Emergency Scenario Buttons */}
      <div className="clay-card p-6 space-y-4">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Frequent Emergency Scenarios (Tap for instant triage)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {quickScenarios.map(sc => (
            <button
              key={sc.id}
              onClick={() => handleSelectQuickPrompt(sc)}
              className="clay-button-secondary text-left p-3.5 flex flex-col justify-between gap-2 group transition-all"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-extrabold text-slate-800 group-hover:text-emerald-800">
                  {sc.label}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                {sc.query}
              </p>
            </button>
          ))}
        </div>

        {/* Custom Input Form */}
        <div className="pt-2">
          <label htmlFor="copilot-input" className="text-xs font-bold text-slate-700 mb-2 block">
            Or describe your specific situation:
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="clay-inset flex-1 px-4 py-3 flex items-center gap-2">
              <input
                id="copilot-input"
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendQuestion();
                  }
                }}
                placeholder="e.g., Someone called asking for Rs 1000 fee on EasyPaisa for lottery win..."
                className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
              />
            </div>
            <button
              onClick={() => handleSendQuestion()}
              disabled={isLoading || !question.trim()}
              className="clay-button-primary px-6 py-3 text-xs font-bold flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing with AI...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Get AI Guidance</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Response Display */}
      {response && (
        <div className="space-y-5 animate-in fade-in duration-300">
          {/* Summary Card */}
          <div className={`clay-card p-6 sm:p-8 space-y-4 ${
            response.urgencyLevel === 'immediate'
              ? 'clay-banner-critical'
              : response.urgencyLevel === 'high'
              ? 'clay-banner-elevated'
              : 'clay-banner-cyan'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl text-white ${
                  response.urgencyLevel === 'immediate' ? 'bg-rose-700' : 'bg-emerald-800'
                }`}>
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Incident Assessment
                  </h3>
                  <span className="text-xs text-slate-600 font-semibold uppercase tracking-wider">
                    Priority Level: {response.urgencyLevel}
                  </span>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                response.urgencyLevel === 'immediate'
                  ? 'bg-rose-600 text-white'
                  : 'bg-emerald-700 text-white'
              }`}>
                {response.urgencyLevel === 'immediate' ? 'Action Required Immediately' : 'Precautionary Guidance'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed bg-white/60 p-4 rounded-2xl border border-white/80">
              {response.summary}
            </p>
          </div>

          {/* Action Steps */}
          <div className="clay-card p-6 sm:p-8 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Immediate Containment Steps (Next 15–30 Minutes)</span>
            </h3>

            <div className="space-y-3">
              {response.immediateActions.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 shadow-2xs"
                >
                  <span className="w-6 h-6 rounded-xl bg-emerald-800 text-white text-xs font-black flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Official Helplines */}
          <div className="clay-card p-6 sm:p-8 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-sky-700" />
              <span>Official Regulatory & Cybercrime Helplines</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {response.helplines.map((hl, idx) => (
                <div
                  key={idx}
                  className="clay-card p-4 space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 block">
                      {hl.entity}
                    </span>
                    <span className="text-xs font-mono font-black text-emerald-800 block mt-1">
                      {hl.phone}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      {hl.note}
                    </p>
                  </div>
                  {hl.website && (
                    <a
                      href={hl.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 hover:text-sky-900 pt-2"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>

            {response.practicalAdvice && (
              <div className="mt-4 p-4 bg-amber-50/80 rounded-2xl border border-amber-200/80 text-xs text-amber-900 font-medium leading-relaxed">
                <strong>Important Safety Insight:</strong> {response.practicalAdvice}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
