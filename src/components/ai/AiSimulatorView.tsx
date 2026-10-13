import React, { useState, useEffect } from 'react';
import {
  Sparkles, ShieldCheck, AlertOctagon, CheckCircle2, XCircle, ArrowRight,
  HelpCircle, RefreshCw, Trophy, BrainCircuit
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useToast } from '../ui/Toast.tsx';
import { ClaySticker, ClayStamp, STICKER_IMAGES } from '../ui/ClaySticker.tsx';

interface SimulationScenario {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  language: string;
  sender: string;
  message: string;
  isScam: boolean;
  redFlags: string[];
  learningPoints: string;
}

export const AiSimulatorView: React.FC = () => {
  const { t } = useLanguage();
  const { showToast } = useToast();

  const [scenario, setScenario] = useState<SimulationScenario | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('intermediate');
  const [selectedCategory, setSelectedCategory] = useState<string>('mixed');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userGuess, setUserGuess] = useState<boolean | null>(null);
  const [score, setScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });

  const fetchScenario = async () => {
    setIsLoading(true);
    setUserGuess(null);
    try {
      const res = await fetch('/api/v1/ai/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          difficulty: selectedDifficulty,
          language: 'en'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setScenario(data.simulation);
      } else {
        throw new Error();
      }
    } catch {
      showToast('Could not load AI simulation scenario.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchScenario();
  }, [selectedDifficulty, selectedCategory]);

  const handleGuess = (guessIsScam: boolean) => {
    if (userGuess !== null || !scenario) return;
    setUserGuess(guessIsScam);

    const isCorrect = guessIsScam === scenario.isScam;
    setScore(prev => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      total: prev.total + 1
    }));

    if (isCorrect) {
      showToast('Excellent! You correctly identified the message threat status.', 'success');
    } else {
      showToast('Deceptive trap! Review the highlighted red flags below.', 'warning');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title & Score Banner with Tactile Clay Mascot */}
      <div className="clay-card p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative overflow-hidden">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-900 rounded-full text-xs font-bold mb-2 shadow-xs border border-white">
            <BrainCircuit className="w-3.5 h-3.5 text-emerald-800" />
            <span>Interactive Cyber Defense Trainer</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            AI Threat Awareness Simulator
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-lg font-medium">
            Test your detection instincts against synthetic scam lures and legitimate automated notifications.
          </p>
        </div>

        {/* Score Counter & Clay Sticker */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3.5 bg-white border border-white rounded-2xl flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Training Score
              </span>
              <div className="text-base sm:text-lg font-black font-mono text-slate-900">
                {score.correct} / {score.total} <span className="text-xs font-normal text-slate-500">correct</span>
              </div>
            </div>
          </div>

          <div className="hidden sm:block">
            <ClaySticker
              imageSrc={STICKER_IMAGES.aiRobotDetective}
              alt="AI Detective Mascot"
              size="sm"
              rotation={-4}
              badgeText="DRILL"
            />
          </div>
        </div>
      </div>

      {/* Controls & Scenario Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">Difficulty:</span>
          {['beginner', 'intermediate', 'advanced'].map(d => (
            <button
              key={d}
              onClick={() => setSelectedDifficulty(d)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl capitalize transition-all ${
                selectedDifficulty === d
                  ? 'clay-button-primary'
                  : 'clay-button-secondary'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <button
          onClick={fetchScenario}
          disabled={isLoading}
          className="clay-button-secondary flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-800' : ''}`} />
          <span>New Scenario</span>
        </button>
      </div>

      {/* Simulator Scenario Card */}
      {isLoading ? (
        <div className="clay-card p-12 text-center text-slate-500 space-y-3">
          <Sparkles className="w-6 h-6 animate-spin mx-auto text-emerald-800" />
          <p className="text-xs font-medium">Generating realistic threat simulation with Gemini...</p>
        </div>
      ) : scenario ? (
        <div className="clay-card p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-mono uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold">
                {scenario.category}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                {scenario.title}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block font-mono">Incoming Message From:</span>
              <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md">
                {scenario.sender}
              </span>
            </div>
          </div>

          {/* Simulated Mobile Message Bubble */}
          <div className="p-4 sm:p-5 clay-inset max-w-lg mx-auto rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>{scenario.sender}</span>
              <span>Today 11:42 AM</span>
            </div>
            <p className="text-sm font-mono text-slate-900 leading-relaxed bg-white p-3.5 rounded-xl shadow-xs border border-white">
              "{scenario.message}"
            </p>
          </div>

          {/* Action Choice Buttons */}
          {userGuess === null ? (
            <div className="space-y-3 pt-2">
              <span className="block text-center text-xs font-semibold text-slate-600">
                What is your assessment of this incoming communication?
              </span>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => handleGuess(true)}
                  className="w-full sm:w-auto px-6 py-3 clay-button-rose flex items-center justify-center gap-2 text-sm font-bold"
                >
                  <AlertOctagon className="w-4 h-4" />
                  <span>Flag as Phishing / Scam</span>
                </button>
                <button
                  onClick={() => handleGuess(false)}
                  className="w-full sm:w-auto px-6 py-3 clay-button-primary flex items-center justify-center gap-2 text-sm font-bold"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Mark as Genuine Notification</span>
                </button>
              </div>
            </div>
          ) : (
            /* Result Evaluation & Coaching with Tactile Stamps */
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-4 ${
              userGuess === scenario.isScam
                ? 'clay-banner-low'
                : 'clay-banner-critical'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/60">
                <div className="flex items-center gap-3">
                  {userGuess === scenario.isScam ? (
                    <CheckCircle2 className="w-7 h-7 text-emerald-700 shrink-0" />
                  ) : (
                    <XCircle className="w-7 h-7 text-rose-700 shrink-0" />
                  )}
                  <div>
                    <h4 className="text-base font-black text-slate-900">
                      {userGuess === scenario.isScam ? 'Correct Assessment!' : 'Caution: Deceptive Trap!'}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      This message was actually: <strong className="font-black uppercase text-slate-900">{scenario.isScam ? 'Fraudulent / Scam' : 'Legitimate Notification'}</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <ClayStamp
                    text={scenario.isScam ? 'MALICIOUS TRAP' : 'GENUINE DISPATCH'}
                    variant={scenario.isScam ? 'danger' : 'success'}
                    rotation={scenario.isScam ? -3 : 2}
                  />
                  <div className="hidden sm:block">
                    <ClaySticker
                      imageSrc={scenario.isScam ? STICKER_IMAGES.phishingBlocked : STICKER_IMAGES.securitySeal}
                      alt={scenario.isScam ? 'Phishing Hook' : 'Security Seal'}
                      size="sm"
                      rotation={scenario.isScam ? 4 : -4}
                      badgeText={scenario.isScam ? 'THREAT' : 'SAFE'}
                    />
                  </div>
                </div>
              </div>

              {scenario.redFlags.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
                    Identified Deceptive Red Flags:
                  </span>
                  <ul className="space-y-1">
                    {scenario.redFlags.map((rf, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                        <span className="text-rose-600 font-bold">✕</span>
                        <span>{rf}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="p-3 bg-white/80 rounded-xl text-xs text-slate-800 leading-relaxed border border-white">
                <span className="font-bold text-slate-900 block mb-0.5">Key Cybersecurity Takeaway:</span>
                {scenario.learningPoints}
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={fetchScenario}
                  className="clay-button-primary px-4 py-2 text-xs font-bold flex items-center gap-1.5"
                >
                  <span>Next Challenge</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
