import React, { useEffect, useState } from 'react';
import { Save, Download, Trash2, Cookie, Check, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { useToast } from '../ui/Toast.tsx';
import { SupportedLanguage } from '../../types/index.ts';

interface SettingsViewProps {
  onOpenCookies: () => void;
  onClearAllHistory: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onOpenCookies, onClearAllHistory }) => {
  const { t, language, setLanguage } = useLanguage();
  const { getAuthHeaders, user } = useAuth();
  const { showToast } = useToast();

  const [retentionDays, setRetentionDays] = useState<number>(90);
  const [autoDeleteLowRisk, setAutoDeleteLowRisk] = useState<boolean>(false);
  const [preferredLang, setPreferredLang] = useState<SupportedLanguage>(language);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/v1/settings', {
          headers: getAuthHeaders()
        });
        if (res.ok) {
          const data = await res.json();
          setRetentionDays(data.settings.retention_days || 90);
          setAutoDeleteLowRisk(data.settings.auto_delete_low_risk || false);
          setPreferredLang(data.settings.preferred_language || language);
        }
      } catch {
        // Fall back to defaults
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/v1/settings', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          retention_days: retentionDays,
          auto_delete_low_risk: autoDeleteLowRisk,
          preferred_language: preferredLang
        })
      });

      if (res.ok) {
        setLanguage(preferredLang);
        showToast('Preferences saved successfully.', 'success');
      } else {
        throw new Error();
      }
    } catch {
      showToast('Could not save preferences.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPersonalData = async () => {
    try {
      const res = await fetch('/api/v1/account/export', {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scamshield-export-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Personal security records exported.', 'success');
    } catch {
      showToast('Failed to export personal data.', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-neutral-200 rounded-xl p-8 text-center text-slate-500">
        <Sparkles className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-800" />
        <span className="text-xs">Loading user settings...</span>
      </div>
    );
  }

  return (
    <div className="clay-card p-6 sm:p-8 space-y-7 max-w-3xl w-full">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
          {t('settingsTitle')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
          {t('settingsSubtitle')}
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Retention Settings */}
        <div className="space-y-3 pb-6 border-b border-slate-100">
          <label className="block text-xs font-bold text-slate-900">
            {t('dataRetentionLabel')}
          </label>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-600 font-medium">
              <span>Automatic record expiration</span>
              <span className="font-mono font-bold text-emerald-800">
                {retentionDays} {t('daysSuffix')}
              </span>
            </div>
            <input
              type="range"
              min={7}
              max={365}
              step={7}
              value={retentionDays}
              onChange={(e) => setRetentionDays(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-800 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>7 days</span>
              <span>90 days</span>
              <span>365 days</span>
            </div>
          </div>

          <label className="flex items-center gap-2.5 pt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoDeleteLowRisk}
              onChange={(e) => setAutoDeleteLowRisk(e.target.checked)}
              className="rounded text-emerald-800 focus:ring-emerald-700 w-4 h-4"
            />
            <span className="text-xs text-slate-700 font-medium">
              {t('autoDeleteLabel')}
            </span>
          </label>
        </div>

        {/* Preferred Language */}
        <div className="space-y-2 pb-6 border-b border-slate-100">
          <label className="block text-xs font-bold text-slate-900">
            Preferred Default Language
          </label>
          <select
            value={preferredLang}
            onChange={(e) => setPreferredLang(e.target.value as SupportedLanguage)}
            className="w-full max-w-xs py-2 px-3 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none shadow-2xs"
          >
            <option value="en">English</option>
            <option value="ur">اردو (Urdu)</option>
            <option value="ru">Roman Urdu</option>
          </select>
        </div>

        {/* Save button */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="clay-button-primary flex items-center gap-2 px-5 py-2.5 text-xs font-bold disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Preferences'}</span>
          </button>
        </div>
      </form>

      {/* Data Governance & Portability */}
      <div className="pt-2 space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
          Privacy & Data Governance
        </h3>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={handleDownloadPersonalData}
            className="clay-button-secondary flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>{t('downloadDataBtn')}</span>
          </button>
          <button
            onClick={onOpenCookies}
            className="clay-button-secondary flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700"
          >
            <Cookie className="w-3.5 h-3.5 text-slate-600" />
            <span>{t('cookiePreferencesBtn')}</span>
          </button>
          <button
            onClick={onClearAllHistory}
            className="clay-button-rose flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold"
          >
            <Trash2 className="w-3.5 h-3.5 text-white" />
            <span>{t('btnClearAllHistory')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
