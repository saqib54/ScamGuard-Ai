import React, { useState } from 'react';
import {
  ShieldAlert, ShieldCheck, AlertTriangle, AlertOctagon,
  Copy, Download, Flag, RotateCcw, Check, ExternalLink, HelpCircle,
  Sparkles, BrainCircuit, UserCheck, MessageSquare, ChevronDown, ChevronUp
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { useToast } from '../ui/Toast.tsx';
import { AnalysisResult, RiskLevel } from '../../types/index.ts';
import { ClaySticker, ClayStamp, STICKER_IMAGES } from '../ui/ClaySticker.tsx';

interface AnalysisResultCardProps {
  analysis: AnalysisResult;
  onNewScan: () => void;
}

interface AiDeepDiveData {
  psychology: {
    emotionalTrigger: string;
    vulnerabilityTargeted: string;
    attackerStrategy: string;
  };
  whatIfScenario: string[];
  familyWarningAlert: {
    english: string;
    urdu: string;
    romanUrdu: string;
  };
}

interface AiSafeReplyData {
  reply: string;
  tips: string[];
}

export const AnalysisResultCard: React.FC<AnalysisResultCardProps> = ({ analysis, onNewScan }) => {
  const { t } = useLanguage();
  const { getAuthHeaders } = useAuth();
  const { showToast } = useToast();

  const [copied, setCopied] = useState<boolean>(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [feedbackRating, setFeedbackRating] = useState<'accurate' | 'inaccurate' | 'needs_improvement'>('inaccurate');
  const [feedbackComment, setFeedbackComment] = useState<string>('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState<boolean>(false);

  // AI Deep Dive States
  const [aiDeepDive, setAiDeepDive] = useState<AiDeepDiveData | null>(null);
  const [isLoadingDeepDive, setIsLoadingDeepDive] = useState<boolean>(false);
  const [activeAlertLang, setActiveAlertLang] = useState<'english' | 'urdu' | 'romanUrdu'>('english');
  const [aiSafeReply, setAiSafeReply] = useState<AiSafeReplyData | null>(null);
  const [isLoadingSafeReply, setIsLoadingSafeReply] = useState<boolean>(false);

  const getRiskTheme = (level: RiskLevel) => {
    switch (level) {
      case 'critical':
        return {
          label: t('riskLevelCritical'),
          bannerClass: 'clay-banner-critical',
          badgeBg: 'bg-rose-700 text-white shadow-xs',
          scoreColor: 'text-rose-700',
          icon: AlertOctagon
        };
      case 'high':
        return {
          label: t('riskLevelHigh'),
          bannerClass: 'clay-banner-critical',
          badgeBg: 'bg-rose-600 text-white shadow-xs',
          scoreColor: 'text-rose-600',
          icon: ShieldAlert
        };
      case 'elevated':
        return {
          label: t('riskLevelElevated'),
          bannerClass: 'clay-banner-elevated',
          badgeBg: 'bg-amber-600 text-white shadow-xs',
          scoreColor: 'text-amber-700',
          icon: AlertTriangle
        };
      case 'low':
      default:
        return {
          label: t('riskLevelLow'),
          bannerClass: 'clay-banner-low',
          badgeBg: 'bg-emerald-700 text-white shadow-xs',
          scoreColor: 'text-emerald-700',
          icon: ShieldCheck
        };
    }
  };

  const theme = getRiskTheme(analysis.riskLevel);
  const RiskIcon = theme.icon;

  const handleCopy = () => {
    const reportText = `[ScamShield AI Security Report]
Analysis ID: ${analysis.id}
Date: ${new Date(analysis.createdAt).toLocaleString()}
Input Type: ${analysis.inputType.toUpperCase()} (${analysis.detectedLanguage})
Risk Score: ${analysis.riskScore}/100 [${theme.label}]
Analysis Engine: ${analysis.engineType}

Explanation:
${analysis.explanation}

Detected Indicators:
${analysis.indicators.map(i => `• [${i.severity.toUpperCase()}] ${i.title}: ${i.description} (Evidence: "${i.evidence || ''}")`).join('\n') || 'None'}

Recommended Safe Actions:
${analysis.recommendations.map(r => `• ${r}`).join('\n')}
`;
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    showToast('Report copied to clipboard.', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(analysis, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scamshield-report-${analysis.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('JSON report exported.', 'info');
  };

  const handleTriggerAiDeepDive = async () => {
    if (aiDeepDive) return;
    setIsLoadingDeepDive(true);
    try {
      const res = await fetch('/api/v1/ai/deep-dive', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          content: analysis.contentSnippet,
          inputType: analysis.inputType,
          language: analysis.detectedLanguage
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAiDeepDive(data);
        showToast('AI psychological forensics ready.', 'success');
      } else {
        throw new Error();
      }
    } catch {
      showToast('Could not load AI deep dive.', 'error');
    } finally {
      setIsLoadingDeepDive(false);
    }
  };

  const handleGenerateSafeReply = async () => {
    if (aiSafeReply) return;
    setIsLoadingSafeReply(true);
    try {
      const res = await fetch('/api/v1/ai/safe-reply', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          content: analysis.contentSnippet,
          purpose: 'deterrent',
          language: analysis.detectedLanguage
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAiSafeReply(data);
        showToast('Defensive reply generated.', 'success');
      } else {
        throw new Error();
      }
    } catch {
      showToast('Could not generate safe reply.', 'error');
    } finally {
      setIsLoadingSafeReply(false);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingFeedback(true);
    try {
      const res = await fetch(`/api/v1/analyses/${analysis.id}/feedback`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          rating: feedbackRating,
          comment: feedbackComment
        })
      });
      if (res.ok) {
        showToast('Feedback submitted. Thank you for improving detection accuracy.', 'success');
        setShowFeedbackModal(false);
        setFeedbackComment('');
      } else {
        throw new Error('Failed to submit feedback.');
      }
    } catch {
      showToast('Could not save feedback.', 'error');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  return (
    <div className="clay-card p-6 sm:p-8 space-y-7">
      {/* Top Banner / Assessment Summary */}
      <div className={`p-5 sm:p-6 ${theme.bannerClass} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5`}>
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-white shadow-xs shrink-0 border border-white">
            <RiskIcon className={`w-7 h-7 ${theme.scoreColor}`} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-3 py-1 rounded-xl text-xs font-bold ${theme.badgeBg}`}>
                {theme.label}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                ID: {analysis.id}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-600 font-semibold capitalize">
                {analysis.engineType === 'hybrid' ? t('hybridEngine') : t('heuristicEngine')}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 mt-2 leading-relaxed font-semibold">
              {analysis.explanation}
            </p>
          </div>
        </div>

        {/* Numeric Score Gauge & Tactile Clay Sticker */}
        <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
          <div className="sm:text-right bg-white/90 p-4 rounded-2xl border border-white/80 shadow-xs flex-1 sm:flex-initial">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 block font-bold">
              {t('riskScoreLabel')}
            </span>
            <div className="flex items-baseline sm:justify-end gap-1">
              <span className={`text-4xl sm:text-5xl font-black font-mono tabular-nums ${theme.scoreColor}`}>
                {analysis.riskScore}
              </span>
              <span className="text-xs font-mono text-slate-400 font-bold">/ 100</span>
            </div>
            <div className="mt-1">
              <ClayStamp
                text={
                  analysis.riskScore >= 70
                    ? 'PHISHING DETECTED'
                    : analysis.riskScore <= 35
                    ? 'VERIFIED SAFE'
                    : 'CAUTION ADVISED'
                }
                variant={
                  analysis.riskScore >= 70
                    ? 'danger'
                    : analysis.riskScore <= 35
                    ? 'success'
                    : 'warning'
                }
                rotation={-3}
              />
            </div>
          </div>

          <div className="hidden sm:block">
            <ClaySticker
              imageSrc={
                analysis.riskScore >= 70
                  ? STICKER_IMAGES.phishingBlocked
                  : analysis.riskScore <= 35
                  ? STICKER_IMAGES.securitySeal
                  : STICKER_IMAGES.aiRobotDetective
              }
              alt="Security Assessment 3D Clay Sticker"
              size="sm"
              rotation={analysis.riskScore >= 70 ? -5 : 4}
              badgeText={
                analysis.riskScore >= 70
                  ? 'CRITICAL'
                  : analysis.riskScore <= 35
                  ? 'SAFE SEAL'
                  : 'SUSPICIOUS'
              }
            />
          </div>
        </div>
      </div>

      {/* Uncertainty & Limitations Notice */}
      <div className="flex items-start gap-2.5 p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl text-xs text-slate-600 shadow-2xs">
        <HelpCircle className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />
        <p className="leading-relaxed font-medium">
          {t('uncertaintyNotice')}
        </p>
      </div>

      {/* Submitted Content Snippet */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Inspected Message Content
        </h4>
        <div className="p-4 clay-inset text-xs font-mono text-slate-800 break-words max-h-36 overflow-y-auto">
          {analysis.contentSnippet}
        </div>
      </div>

      {/* Detected Warning Indicators */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          {t('detectedIndicators')} ({analysis.indicators.length})
        </h4>

        {analysis.indicators.length === 0 ? (
          <div className="p-4 clay-banner-low text-xs text-emerald-950 flex items-center gap-2.5 font-medium">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>{t('noIndicatorsDetected')}</span>
          </div>
        ) : (
          <div className="space-y-3">
            {analysis.indicators.map((ind, idx) => {
              let sevClass = 'bg-slate-100 text-slate-700';
              if (ind.severity === 'critical') sevClass = 'bg-rose-100 text-rose-800 border border-rose-200';
              else if (ind.severity === 'high') sevClass = 'bg-rose-50 text-rose-700 border border-rose-100';
              else if (ind.severity === 'medium') sevClass = 'bg-amber-50 text-amber-800 border border-amber-100';

              return (
                <div
                  key={ind.id || idx}
                  className="p-4 bg-white/95 rounded-2xl border border-neutral-200/80 shadow-xs space-y-2"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-900">
                      {ind.title}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${sevClass}`}>
                      {ind.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {ind.description}
                  </p>
                  {ind.evidence && (
                    <div className="text-[11px] text-slate-500 flex items-baseline gap-1.5 pt-1">
                      <span className="font-bold text-slate-700 shrink-0">Flagged Evidence:</span>
                      <code className="bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200 font-mono text-[11px]">
                        "{ind.evidence}"
                      </code>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Structural URL Inspection Details (if available) */}
      {analysis.urlDetails && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
            <span>{t('urlAnalysis')}</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
            <div>
              <span className="font-medium text-slate-500">Hostname: </span>
              <span className="font-mono text-slate-900 font-bold">{analysis.urlDetails.hostname}</span>
            </div>
            <div>
              <span className="font-medium text-slate-500">Protocol: </span>
              <span className="font-mono text-slate-900 font-bold">{analysis.urlDetails.protocol}</span>
            </div>
          </div>
          {analysis.urlDetails.warnings && analysis.urlDetails.warnings.length > 0 && (
            <div className="space-y-1 pt-1">
              {analysis.urlDetails.warnings.map((w, i) => (
                <div key={i} className="text-xs text-amber-900 flex items-start gap-1.5 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>{w}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recommended Safe Actions */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          {t('safeRecommendations')}
        </h4>
        <ul className="space-y-2">
          {analysis.recommendations.map((rec, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2.5 text-xs text-slate-700 bg-emerald-50/40 p-3 rounded-xl border border-emerald-100 font-medium"
            >
              <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* NEW: AI FORENSIC DEEP DIVE SECTION */}
      <div className="pt-2 border-t border-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-800 text-white flex items-center justify-center shadow-xs">
              <BrainCircuit className="w-4 h-4 text-emerald-200" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-slate-900">
                AI Fraud Forensic Investigator (Gemini 3.8 Flash)
              </h4>
              <p className="text-[11px] text-slate-500">
                Deep behavioral analysis, attack simulations, and tailored warning scripts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!aiDeepDive && (
              <button
                onClick={handleTriggerAiDeepDive}
                disabled={isLoadingDeepDive}
                className="clay-button-primary px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isLoadingDeepDive ? 'animate-spin' : ''}`} />
                <span>{isLoadingDeepDive ? 'Analyzing Psychology...' : 'Run AI Deep Dive'}</span>
              </button>
            )}

            {!aiSafeReply && (
              <button
                onClick={handleGenerateSafeReply}
                disabled={isLoadingSafeReply}
                className="clay-button-secondary px-3 py-1.5 text-xs font-bold flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                <span>{isLoadingSafeReply ? 'Drafting...' : 'Defensive Reply'}</span>
              </button>
            )}
          </div>
        </div>

        {/* AI Deep Dive Result Display */}
        {aiDeepDive && (
          <div className="clay-card p-5 space-y-4 bg-slate-50/60 border border-slate-200">
            {/* Psychology Card */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <BrainCircuit className="w-3.5 h-3.5 text-emerald-800" />
                <span>Attacker Psychology & Cognitive Manipulation</span>
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="font-bold text-slate-700 block mb-0.5">Emotional Trigger:</span>
                  <p className="text-slate-600 leading-relaxed">{aiDeepDive.psychology.emotionalTrigger}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="font-bold text-slate-700 block mb-0.5">Target Vulnerability:</span>
                  <p className="text-slate-600 leading-relaxed">{aiDeepDive.psychology.vulnerabilityTargeted}</p>
                </div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs text-xs">
                <span className="font-bold text-slate-700 block mb-0.5">Social Engineering Strategy:</span>
                <p className="text-slate-600 leading-relaxed">{aiDeepDive.psychology.attackerStrategy}</p>
              </div>
            </div>

            {/* What-If Attack Chain */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide block">
                Multi-Stage Compromise Chain (What happens if a victim clicks?)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {aiDeepDive.whatIfScenario.map((step, idx) => (
                  <div key={idx} className="p-2.5 bg-rose-50/60 border border-rose-100 rounded-xl text-rose-950">
                    <span className="font-bold font-mono text-[10px] text-rose-700 uppercase block mb-0.5">Stage {idx + 1}</span>
                    <p className="text-xs leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tailored Family Warning Generator */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Shareable Family Warning Alert
                </span>
                <div className="flex items-center gap-1 bg-slate-200 rounded-lg p-0.5 text-[10px] font-bold">
                  {(['english', 'urdu', 'romanUrdu'] as const).map(l => (
                    <button
                      key={l}
                      onClick={() => setActiveAlertLang(l)}
                      className={`px-2 py-0.5 rounded capitalize ${activeAlertLang === l ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start justify-between gap-3">
                <p className={`text-xs text-slate-800 leading-relaxed ${activeAlertLang === 'urdu' ? 'font-urdu' : 'font-sans'}`}>
                  {aiDeepDive.familyWarningAlert[activeAlertLang]}
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(aiDeepDive.familyWarningAlert[activeAlertLang]);
                    showToast('Family warning copied to clipboard.', 'success');
                  }}
                  className="clay-button-secondary p-1.5 text-slate-600 hover:text-slate-900 shrink-0"
                  title="Copy alert"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI Defensive Reply Display */}
        {aiSafeReply && (
          <div className="clay-card p-4 bg-emerald-50/50 border border-emerald-200 space-y-2 text-xs">
            <span className="font-bold text-emerald-950 uppercase tracking-wide block">
              Deterrent Auto-Reply Template (Safe to send):
            </span>
            <div className="p-3 bg-white rounded-xl border border-emerald-200 flex items-start justify-between gap-3">
              <p className="font-mono text-slate-800">{aiSafeReply.reply}</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(aiSafeReply.reply);
                  showToast('Defensive reply copied.', 'success');
                }}
                className="clay-button-secondary p-1.5 text-slate-600 shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            {aiSafeReply.tips.length > 0 && (
              <p className="text-[11px] text-slate-500 pt-1">
                Tip: {aiSafeReply.tips.join(' ')}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Actions Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-neutral-100">
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="clay-button-secondary flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : t('btnCopyReport')}</span>
          </button>
          <button
            onClick={handleExportJson}
            className="clay-button-secondary flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t('btnExportJson')}</span>
          </button>
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 rounded-xl transition-colors"
          >
            <Flag className="w-3.5 h-3.5 inline mr-1" />
            <span>{t('btnReportIssue')}</span>
          </button>
        </div>

        <button
          onClick={onNewScan}
          className="clay-button-primary flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t('btnNewScan')}</span>
        </button>
      </div>

      {/* Inaccuracy Reporting Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="clay-card max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {t('btnReportIssue')}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Help refine ScamShield detection models by submitting corrections.
              </p>
            </div>

            <form onSubmit={handleSubmitFeedback} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Assessment
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'inaccurate', label: 'False Positive' },
                    { id: 'needs_improvement', label: 'Incomplete' },
                    { id: 'accurate', label: 'Accurate' },
                  ].map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setFeedbackRating(r.id as any)}
                      className={`text-xs py-1.5 px-2 rounded-xl font-bold transition-all ${
                        feedbackRating === r.id
                          ? 'clay-button-primary'
                          : 'clay-button-secondary'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Details or Reason (Optional)
                </label>
                <textarea
                  rows={3}
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="Explain why this assessment was inaccurate..."
                  className="w-full text-xs p-3 clay-inset focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingFeedback}
                  className="clay-button-primary px-4 py-2 text-xs font-bold disabled:opacity-50"
                >
                  {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
