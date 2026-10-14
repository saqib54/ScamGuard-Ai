import React from 'react';
import {
  Shield, Settings, User as UserIcon, LogOut, Menu, X, BrainCircuit,
  Sparkles, Sun, Moon, Presentation
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
  const { isDark, toggleTheme } = useTheme();
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
            <div className="clay-sticker p-0.5 rounded-2xl transition-transform group-hover:scale-105 group-hover:rotate-3 shadow-md shrink-0 bg-emerald-600/10 flex items-center justify-center">
              <img
                src={STICKER_IMAGES.securitySeal}
                alt="ScamShield 3D Clay Seal"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
                referrerPolicy="no-referrer"
                className="w-9 h-9 sm:w-10 sm:h-10 object-cover rounded-xl"
              />
              <span className="text-xl sm:text-2xl [display:none] group-has-[img[style*='display:_none']]:inline-block group-has-[img[style*='display: none']]:inline-block">🛡️</span>
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

        {/* Zone 3: Night Mode Toggle, Language & User Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Night Mode Tactile Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition-all clay-button-secondary relative group ${
              isDark ? 'text-amber-400' : 'text-slate-600'
            }`}
            title={isDark ? 'Switch to Daylight Mode' : 'Switch to Night Mode (Dark)'}
            aria-label={isDark ? 'Switch to Daylight Mode' : 'Switch to Night Mode'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform group-hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 transition-transform group-hover:-rotate-12" />
            )}
          </button>

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
            <button
              onClick={() => {
                toggleTheme();
              }}
              className="flex items-center justify-center gap-2 p-2.5 text-xs font-bold rounded-xl clay-button-secondary"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
              <span>{isDark ? 'Daylight Mode' : 'Night Mode'}</span>
            </button>
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
