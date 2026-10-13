import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { ToastProvider, useToast } from './components/ui/Toast.tsx';
import { Navbar } from './components/layout/Navbar.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { LandingView } from './components/landing/LandingView.tsx';
import { MessageScanner } from './components/scanner/MessageScanner.tsx';
import { AnalysisResultCard } from './components/analysis/AnalysisResultCard.tsx';
import { DashboardView } from './components/dashboard/DashboardView.tsx';
import { AiSimulatorView } from './components/ai/AiSimulatorView.tsx';
import { AiCopilotView } from './components/ai/AiCopilotView.tsx';
import { HistoryView } from './components/history/HistoryView.tsx';
import { SafetyCenter } from './components/safety/SafetyCenter.tsx';
import { SettingsView } from './components/settings/SettingsView.tsx';
import { LegalModal } from './components/legal/LegalModal.tsx';
import { CookieBanner } from './components/cookie/CookieBanner.tsx';
import { AuthModal } from './components/auth/AuthModal.tsx';
import { AnalysisResult, InputType } from './types/index.ts';

function ScamShieldApp() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [prefilledScanner, setPrefilledScanner] = useState<{ text: string; type: InputType }>({
    text: '',
    type: 'sms',
  });

  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | 'cookies' | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [forceCookieBanner, setForceCookieBanner] = useState<boolean>(false);

  const { getAuthHeaders } = useAuth();
  const { showToast } = useToast();

  const handleStartScanning = () => {
    setCurrentAnalysis(null);
    setCurrentTab('scanner');
  };

  const handleSelectSample = (text: string, type: InputType) => {
    setPrefilledScanner({ text, type });
    setCurrentAnalysis(null);
    setCurrentTab('scanner');
  };

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setCurrentAnalysis(result);
  };

  const handleSelectHistoryAnalysis = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/analyses/${id}`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentAnalysis(data.analysis);
        setCurrentTab('scanner');
      } else {
        throw new Error();
      }
    } catch {
      showToast('Could not load analysis details.', 'error');
    }
  };

  const handleNewScan = () => {
    setCurrentAnalysis(null);
    setPrefilledScanner({ text: '', type: 'sms' });
    setCurrentTab('scanner');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#EAF0F8] text-slate-900 font-sans">
      {/* 3-Zone Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'scanner') {
            setCurrentAnalysis(null);
          }
        }}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'landing' && (
          <LandingView
            onStartScanning={handleStartScanning}
            onSelectSample={handleSelectSample}
            onOpenSimulator={() => setCurrentTab('simulator')}
            onOpenCopilot={() => setCurrentTab('copilot')}
          />
        )}

        {currentTab === 'scanner' && (
          <div className="max-w-3xl mx-auto space-y-6">
            {currentAnalysis ? (
              <AnalysisResultCard
                analysis={currentAnalysis}
                onNewScan={handleNewScan}
              />
            ) : (
              <MessageScanner
                key={`${prefilledScanner.text}-${prefilledScanner.type}`}
                initialContent={prefilledScanner.text}
                initialType={prefilledScanner.type}
                onAnalysisComplete={handleAnalysisComplete}
              />
            )}
          </div>
        )}

        {currentTab === 'copilot' && <AiCopilotView />}

        {currentTab === 'simulator' && <AiSimulatorView />}

        {currentTab === 'dashboard' && (
          <DashboardView
            onStartScan={handleStartScanning}
            onSelectAnalysis={handleSelectHistoryAnalysis}
          />
        )}

        {currentTab === 'safety' && <SafetyCenter />}

        {currentTab === 'history' && (
          <HistoryView
            onSelectAnalysis={handleSelectHistoryAnalysis}
            onStartScan={handleStartScanning}
          />
        )}

        {currentTab === 'settings' && (
          <div className="flex justify-center">
            <SettingsView
              onOpenCookies={() => setForceCookieBanner(true)}
              onClearAllHistory={() => setCurrentTab('history')}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenLegal={(type) => setLegalModalType(type)}
        onOpenSafety={() => setCurrentTab('safety')}
      />

      {/* Global Modals & Controls */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />

      <CookieBanner
        forceOpen={forceCookieBanner}
        onCloseForce={() => setForceCookieBanner(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ToastProvider>
          <ScamShieldApp />
        </ToastProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
