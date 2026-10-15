import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { safeStorage } from '../../utils/storage.ts';

interface CookieBannerProps {
  onOpenPreferences?: () => void;
  forceOpen?: boolean;
  onCloseForce?: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({
  forceOpen = false,
  onCloseForce
}) => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [showCustomize, setShowCustomize] = useState<boolean>(false);
  const [analyticsConsent, setAnalyticsConsent] = useState<boolean>(false);

  useEffect(() => {
    const consent = safeStorage.getItem('scamshield_cookie_consent');
    if (!consent || forceOpen) {
      setIsVisible(true);
      if (consent) {
        setAnalyticsConsent(consent === 'all');
      }
    } else {
      setIsVisible(false);
    }
  }, [forceOpen]);

  const handleAcceptAll = () => {
    safeStorage.setItem('scamshield_cookie_consent', 'all');
    setIsVisible(false);
    if (onCloseForce) onCloseForce();
  };

  const handleRejectOptional = () => {
    safeStorage.setItem('scamshield_cookie_consent', 'necessary');
    setIsVisible(false);
    if (onCloseForce) onCloseForce();
  };

  const handleSaveCustom = () => {
    safeStorage.setItem('scamshield_cookie_consent', analyticsConsent ? 'all' : 'necessary');
    setIsVisible(false);
    setShowCustomize(false);
    if (onCloseForce) onCloseForce();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-white dark:bg-[#111a2e] border border-neutral-300 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-slate-100">
          <Cookie className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
          <span>Cookie & Privacy Preferences</span>
        </div>
        {forceOpen && (
          <button
            onClick={() => {
              setIsVisible(false);
              if (onCloseForce) onCloseForce();
            }}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        ScamShield AI utilizes strictly necessary storage for authentication and session history. We do not track personal identifying information across external services.
      </p>

      {showCustomize ? (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
          <label className="flex items-center justify-between cursor-not-allowed opacity-80">
            <span className="font-medium text-slate-700">Strictly Necessary (Required)</span>
            <input type="checkbox" checked disabled className="rounded text-emerald-800" />
          </label>
          <label className="flex items-center justify-between cursor-pointer pt-1 border-t border-slate-200">
            <span className="font-medium text-slate-700">Anonymous Security Diagnostics</span>
            <input
              type="checkbox"
              checked={analyticsConsent}
              onChange={(e) => setAnalyticsConsent(e.target.checked)}
              className="rounded text-emerald-800 focus:ring-emerald-700"
            />
          </label>
          <div className="flex justify-end pt-2">
            <button
              onClick={handleSaveCustom}
              className="px-3 py-1 bg-emerald-800 text-white rounded text-xs font-semibold"
            >
              Save Preferences
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <button
            onClick={handleAcceptAll}
            className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-md font-semibold transition-colors"
          >
            Accept All
          </button>
          <button
            onClick={handleRejectOptional}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium transition-colors"
          >
            Reject Optional
          </button>
          <button
            onClick={() => setShowCustomize(true)}
            className="px-2.5 py-1.5 text-slate-500 hover:text-slate-800 underline text-[11px]"
          >
            Customize
          </button>
        </div>
      )}
    </div>
  );
};
