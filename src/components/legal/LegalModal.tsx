import React from 'react';
import { X, ShieldCheck, Lock, FileText, Cookie } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface LegalModalProps {
  type: 'privacy' | 'terms' | 'cookies' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  const { t } = useLanguage();

  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="clay-card bg-white dark:bg-[#111a2e] rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-neutral-200 dark:border-slate-800">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {type === 'privacy' && <Lock className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />}
            {type === 'terms' && <FileText className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />}
            {type === 'cookies' && <Cookie className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />}
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {type === 'privacy' && t('legalPrivacyPolicy')}
              {type === 'terms' && t('legalTerms')}
              {type === 'cookies' && t('legalCookies')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md"
            aria-label="Close legal modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {type === 'privacy' && (
            <>
              <p className="font-semibold text-slate-900 dark:text-slate-100">Effective Date: October 2026</p>
              <h3 className="font-bold text-slate-900 text-sm">1. Information We Process</h3>
              <p>
                ScamShield AI inspects user-submitted text and URLs strictly to evaluate security indicators, social engineering patterns, and threat indicators. Submitted contents are analyzed ephemerally in-memory. Only sanitized cryptographic hashes (SHA-256) and summarized threat categories are stored in your private history.
              </p>
              <h3 className="font-bold text-slate-900 text-sm">2. Zero Outbound SSRF Guarantee</h3>
              <p>
                When you submit a URL, our backend parses its domain and lexical composition locally. We never perform outbound HTTP/HTTPS requests to user-submitted links, preventing accidental trigger of tracking pixels, payload download, or internal network scanning.
              </p>
              <h3 className="font-bold text-slate-900 text-sm">3. Retention and Right to Deletion</h3>
              <p>
                You retain complete ownership of your analysis records. You may export your entire dataset in JSON format at any time or execute irreversible permanent purge through the Settings panel.
              </p>
              <h3 className="font-bold text-slate-900 text-sm">4. Third-Party AI Processing</h3>
              <p>
                Where configured, contextual reasoning utilizes server-side Google Gemini models under strict untrusted-content encapsulation. No training or retention on user-submitted data occurs.
              </p>
            </>
          )}

          {type === 'terms' && (
            <>
              <p className="font-semibold text-slate-900">Effective Date: October 2026</p>
              <h3 className="font-bold text-slate-900 text-sm">1. Purpose and Limitations</h3>
              <p>
                ScamShield AI is an advisory cybersecurity utility designed to assist users in identifying common patterns of fraud, smishing, phishing, and deceptive links.
              </p>
              <h3 className="font-bold text-slate-900 text-sm">2. No Guarantee of Definite Safety</h3>
              <p>
                ScamShield AI does not claim or warrant that any message, link, or sender is 100% legitimate, safe, or malware-free merely because no overt warning signs were triggered. Users must maintain personal diligence and verify sensitive financial or identity claims directly through official institutions.
              </p>
              <h3 className="font-bold text-slate-900 text-sm">3. Responsible Use</h3>
              <p>
                You agree not to use the service to test or refine weaponized malware, conduct denial-of-service tests, or reverse-engineer security mitigations for unlawful purposes.
              </p>
            </>
          )}

          {type === 'cookies' && (
            <>
              <p className="font-semibold text-slate-900">Effective Date: October 2026</p>
              <h3 className="font-bold text-slate-900 text-sm">1. Essential Storage</h3>
              <p>
                ScamShield AI uses local storage and strictly necessary session identifiers to manage authentication, maintain your guest scan history, and remember language preferences. These are essential for the operation of the application.
              </p>
              <h3 className="font-bold text-slate-900 text-sm">2. Optional Telemetry</h3>
              <p>
                We do not deploy non-essential tracking cookies or third-party marketing beacons without your explicit opt-in consent. You can update your consent status at any time in Settings.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
