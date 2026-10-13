import React from 'react';
import { Shield, Settings, User as UserIcon, LogOut, Menu, X, BrainCircuit, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { SupportedLanguage } from '../../types/index.ts';
import { STICKER_IMAGES } from '../ui/ClaySticker.tsx';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, onOpenAuth }) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'scanner', label: t('navScanner') },
    { id: 'copilot', label: 'AI Copilot' },
    { id: 'simulator', label: 'AI Simulator' },
    { id: 'dashboard', label: t('navDashboard') },
    { id: 'safety', label: t('navSafety') },
    { id: 'history', label: t('navHistory') },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#EAF0F8]/90 backdrop-blur-md border-b border-white/60 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark with Tactile 3D Clay Seal */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('landing')}
            className="flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-xl group"
          >
            <div className="clay-sticker p-0.5 rounded-2xl transition-transform group-hover:scale-105 group-hover:rotate-3 shadow-md">
              <img
                src={STICKER_IMAGES.securitySeal}
                alt="ScamShield 3D Clay Seal"
                referrerPolicy="no-referrer"
                className="w-10 h-10 object-cover rounded-xl"
              />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-slate-900 block leading-tight">
                ScamShield AI
              </span>
              <span className="text-[11px] text-slate-500 block font-medium leading-tight">
                {t('tagline')}
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 bg-white/60 rounded-2xl border border-white/80 shadow-xs">
          {navItems.map(item => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 ${
                  isActive
                    ? 'clay-pill-active text-emerald-950 font-extrabold'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-white/40'
                }`}
              >
                {item.id === 'simulator' && <BrainCircuit className="w-3.5 h-3.5 inline mr-1 text-emerald-700" />}
                {item.id === 'copilot' && <Sparkles className="w-3.5 h-3.5 inline mr-1 text-sky-600" />}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Language Toggle & User Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Language Selector */}
          <div className="flex items-center clay-inset p-0.5 rounded-xl text-[11px] font-bold text-slate-600">
            {(['en', 'ur', 'ru'] as SupportedLanguage[]).map(lang => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2 py-1 rounded-lg transition-all ${
                  language === lang
                    ? 'bg-white text-slate-950 shadow-xs font-extrabold'
                    : 'hover:text-slate-950'
                }`}
                title={lang === 'en' ? 'English' : lang === 'ur' ? 'اردو' : 'Roman Urdu'}
              >
                {lang === 'en' ? 'EN' : lang === 'ur' ? 'اردو' : 'RU'}
              </button>
            ))}
          </div>

          {/* Settings Tab Button */}
          <button
            onClick={() => onSelectTab('settings')}
            className={`p-2 rounded-xl text-slate-600 hover:text-slate-900 clay-button-secondary transition-all ${
              currentTab === 'settings' ? 'bg-white text-slate-950' : ''
            }`}
            title={t('navSettings')}
            aria-label={t('navSettings')}
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User Auth or Sign In */}
          {user ? (
            <div className="flex items-center gap-2">
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-emerald-900 rounded-xl text-xs font-bold border border-white shadow-xs"
                title={user.email}
              >
                <UserIcon className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden sm:inline max-w-[120px] truncate">{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                title={t('navSignOut')}
                aria-label={t('navSignOut')}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="clay-button-primary px-3.5 py-1.5 text-xs font-bold whitespace-nowrap"
            >
              {t('navSignIn')}
            </button>
          )}

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl clay-button-secondary"
            aria-label="Toggle mobile navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/60 bg-white/95 backdrop-blur-md px-4 pt-2 pb-4 space-y-1.5">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
                currentTab === item.id
                  ? 'clay-button-primary'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
