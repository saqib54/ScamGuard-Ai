import React from 'react';
import {
  Shield, Settings, User as UserIcon, LogOut, Menu, X, BrainCircuit,
  Sparkles, Presentation, Sun, Moon, Zap
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { useTheme } from '../../context/ThemeContext.tsx';
import { SupportedLanguage } from '../../types/index.ts';
import { STICKER_IMAGES } from '../ui/ClaySticker.tsx';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, onOpenAuth }) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'scanner', label: t('navScanner') },
    { id: 'copilot', label: 'AI Copilot' },
    { id: 'simulator', label: 'AI Simulator' },
    { id: 'dashboard', label: t('navDashboard') },
    { id: 'safety', label: t('navSafety') },
    { id: 'history', label: t('navHistory') },
    { id: 'docs', label: 'Docs & Slides' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#EAF0F8]/90 dark:bg-[#0a0f1d]/90 backdrop-blur-md border-b border-white/60 dark:border-slate-800/80 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3 sm:gap-6">
        {/* Zone 1: Brand Wordmark with Tactile 3D Clay Seal */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('landing')}
            className="flex items-center gap-2.5 sm:gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-xl group"
          >
            <div className="clay-sticker p-0.5 rounded-2xl transition-transform group-hover:scale-105 group-hover:rotate-3 shadow-md shrink-0 bg-emerald-600/10 flex items-center justify-center w-10 h-10">
              <img
                src={STICKER_IMAGES.securitySeal}
                alt="ScamShield 3D Clay Seal"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const sibling = target.nextElementSibling as HTMLElement;
                  if (sibling) sibling.style.display = 'block';
                }}
                referrerPolicy="no-referrer"
                className="w-9 h-9 sm:w-10 sm:h-10 object-cover rounded-xl"
              />
              <span style={{ display: 'none' }} className="text-xl">🛡️</span>
            </div>
            <div>
              <span className="text-sm sm:text-base font-black tracking-tight text-slate-900 dark:text-slate-100 block leading-tight">
                ScamShield AI
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 block font-medium leading-tight">
                {t('tagline')}
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1 bg-white/60 dark:bg-slate-900/60 rounded-2xl border border-white/80 dark:border-slate-800 shadow-xs">
          {navItems.map(item => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 ${
                  isActive
                    ? 'clay-pill-active text-emerald-950 dark:text-emerald-300 font-extrabold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/40 dark:hover:bg-slate-800/40'
                }`}
              >
                {item.id === 'simulator' && <BrainCircuit className="w-3.5 h-3.5 inline mr-1 text-emerald-700 dark:text-emerald-400" />}
                {item.id === 'copilot' && <Sparkles className="w-3.5 h-3.5 inline mr-1 text-sky-600 dark:text-sky-400" />}
                {item.id === 'docs' && <Presentation className="w-3.5 h-3.5 inline mr-1 text-indigo-600 dark:text-indigo-400" />}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Language & User Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Radar Active</span>
          </div>

          {/* Language Selector */}
          <div className="flex items-center clay-inset p-0.5 rounded-xl text-[10px] sm:text-[11px] font-bold text-slate-600 dark:text-slate-300">
            {(['en', 'ur', 'ru'] as SupportedLanguage[]).map(lang => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-1.5 sm:px-2 py-1 rounded-lg transition-all ${
                  language === lang
                    ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs font-extrabold'
                    : 'hover:text-slate-950 dark:hover:text-white'
                }`}
                title={lang === 'en' ? 'English' : lang === 'ur' ? 'اردو' : 'Roman Urdu'}
              >
                {lang === 'en' ? 'EN' : lang === 'ur' ? 'اردو' : 'RU'}
              </button>
            ))}
          </div>

          {/* Theme Selector: Light | Dark | Cyberpunk */}
          <div className="flex items-center clay-inset p-0.5 rounded-xl text-[10px] sm:text-[11px] font-bold text-slate-600 dark:text-slate-300">
            <button
              onClick={() => setTheme('light')}
              className={`px-1.5 sm:px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
                theme === 'light'
                  ? 'bg-white text-amber-600 shadow-xs font-black'
                  : 'hover:text-slate-950 dark:hover:text-white'
              }`}
              title="Daylight Clay Theme"
              aria-label="Daylight Clay Theme"
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden xl:inline text-[10px]">Light</span>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`px-1.5 sm:px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
                theme === 'dark'
                  ? 'bg-slate-800 text-sky-400 shadow-xs font-black'
                  : 'hover:text-slate-950 dark:hover:text-white'
              }`}
              title="Deep Command Dark Theme"
              aria-label="Deep Command Dark Theme"
            >
              <Moon className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden xl:inline text-[10px]">Dark</span>
            </button>
            <button
              onClick={() => setTheme('cyberpunk')}
              className={`px-1.5 sm:px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
                theme === 'cyberpunk'
                  ? 'bg-black text-[#00f3ff] shadow-xs font-black border border-[#00f3ff]/40 shadow-[0_0_8px_rgba(0,243,255,0.4)]'
                  : 'hover:text-slate-950 dark:hover:text-white'
              }`}
              title="Cyberpunk Neon HUD Theme"
              aria-label="Cyberpunk Neon HUD Theme"
            >
              <Zap className="w-3.5 h-3.5 text-pink-500 sm:text-[#00f3ff]" />
              <span className="hidden xl:inline text-[10px] text-[#00f3ff]">Cyber</span>
            </button>
          </div>

          {/* Settings Tab Button (Desktop / Tablet) */}
          <button
            onClick={() => onSelectTab('settings')}
            className={`hidden sm:inline-flex p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white clay-button-secondary transition-all ${
              currentTab === 'settings' ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white' : ''
            }`}
            title={t('navSettings')}
            aria-label={t('navSettings')}
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User Auth or Sign In */}
          {user ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-white dark:bg-slate-800 text-emerald-900 dark:text-emerald-300 rounded-xl text-xs font-bold border border-white dark:border-slate-700 shadow-xs max-w-[130px] sm:max-w-none"
                title={user.email}
              >
                <UserIcon className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                <span className="truncate">{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                title={t('navSignOut')}
                aria-label={t('navSignOut')}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-1.5">
              <button
                onClick={() => onOpenAuth('register')}
                className="clay-button-primary px-2.5 sm:px-3 py-1.5 text-xs font-extrabold whitespace-nowrap shadow-xs"
              >
                <span className="hidden xs:inline">Create </span>Account
              </button>
              <button
                onClick={() => onOpenAuth('login')}
                className="hidden md:inline-block px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-900 dark:hover:text-emerald-300 rounded-xl hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors"
              >
                Sign In
              </button>
            </div>
          )}

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl clay-button-secondary"
            aria-label="Toggle mobile navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200/60 dark:border-slate-800 bg-white/95 dark:bg-[#111a2e]/98 backdrop-blur-md px-4 pt-3 pb-5 space-y-2 shadow-xl animate-fadeIn">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-center gap-1.5 p-2 text-xs font-bold rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Radar Active</span>
            </div>
            <button
              onClick={() => {
                onSelectTab('settings');
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 p-2.5 text-xs font-bold rounded-xl clay-button-secondary"
            >
              <Settings className="w-4 h-4 text-slate-500" />
              <span>{t('navSettings')}</span>
            </button>
          </div>

          {/* Theme selector in mobile menu */}
          <div className="flex items-center justify-between p-2 rounded-xl clay-inset">
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Theme Mode:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setTheme('light')}
                className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-all ${
                  theme === 'light' ? 'bg-white text-amber-600 shadow-xs' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                ☀️ Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-all ${
                  theme === 'dark' ? 'bg-slate-800 text-sky-400 shadow-xs' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                🌙 Dark
              </button>
              <button
                onClick={() => setTheme('cyberpunk')}
                className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-all ${
                  theme === 'cyberpunk' ? 'bg-black text-[#00f3ff] shadow-xs border border-[#00f3ff]/40' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                ⚡ Cyber
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-between ${
                  currentTab === item.id
                    ? 'clay-button-primary'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <span>{item.label}</span>
                {item.id === 'simulator' && <BrainCircuit className="w-4 h-4 text-emerald-400" />}
                {item.id === 'copilot' && <Sparkles className="w-4 h-4 text-sky-400" />}
                {item.id === 'docs' && <Presentation className="w-4 h-4 text-indigo-400" />}
              </button>
            ))}
          </div>

          {!user && (
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  onOpenAuth('login');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 text-xs font-bold text-center rounded-xl clay-button-secondary"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  onOpenAuth('register');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 text-xs font-black text-center rounded-xl clay-button-primary"
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
