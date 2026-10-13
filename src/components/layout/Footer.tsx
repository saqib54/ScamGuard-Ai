import React from 'react';
import { ShieldCheck, Lock, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface FooterProps {
  onOpenLegal: (type: 'privacy' | 'terms' | 'cookies') => void;
  onOpenSafety: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal, onOpenSafety }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t border-neutral-200 mt-20 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-800" />
              <span>ScamShield AI</span>
              <span className="text-slate-400 font-normal">·</span>
              <span className="text-slate-500 font-normal">{t('tagline')}</span>
            </div>
            <p className="text-slate-600 max-w-md text-xs leading-relaxed">
              {t('footerDisclaimer')}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-800 font-medium">
              <Lock className="w-3.5 h-3.5" />
              <span>Privacy-First: Content is analyzed in memory and scrubbed before storage.</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-2.5">Platform</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenSafety}
                  className="hover:text-slate-900 transition-colors text-left"
                >
                  Emergency Helplines & Guides
                </button>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="hover:text-slate-900 transition-colors"
                >
                  How Analysis Works
                </a>
              </li>
              <li>
                <a
                  href="https://fia.gov.pk/enquiry_trace"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-slate-900 transition-colors inline-flex items-center gap-1"
                >
                  <span>FIA Cyber Crime Wing</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Governance */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-2.5">Compliance & Privacy</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onOpenLegal('privacy')}
                  className="hover:text-slate-900 transition-colors text-left"
                >
                  {t('legalPrivacyPolicy')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('terms')}
                  className="hover:text-slate-900 transition-colors text-left"
                >
                  {t('legalTerms')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('cookies')}
                  className="hover:text-slate-900 transition-colors text-left"
                >
                  {t('legalCookies')}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} ScamShield AI Defense Systems. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span>Built with zero-outbound SSRF isolation</span>
            <span>·</span>
            <span>English, Urdu & Roman Urdu support</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
