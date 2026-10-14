import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare, PhoneCall, Mail, Globe, Sparkles, AlertCircle, Trash2,
  ArrowRight, Wand2, HelpCircle, Image as ImageIcon, Upload, RefreshCw,
  FileCheck, ShieldAlert, Eye, Check
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { useToast } from '../ui/Toast.tsx';
import { AnalysisResult, InputType, SupportedLanguage } from '../../types/index.ts';
import { ClaySticker, ClayStamp, STICKER_IMAGES } from '../ui/ClaySticker.tsx';

interface MessageScannerProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
  initialContent?: string;
  initialType?: InputType;
}

export const MessageScanner: React.FC<MessageScannerProps> = ({
  onAnalysisComplete,
  initialContent = '',
  initialType = 'sms'
}) => {
  const { t } = useLanguage();
  const { getAuthHeaders } = useAuth();
  const { showToast } = useToast();

  const [scanMode, setScanMode] = useState<'text' | 'image'>(
    initialType === 'screenshot' ? 'image' : 'text'
  );
  const [content, setContent] = useState<string>(initialContent);
  const [inputType, setInputType] = useState<InputType>(initialType === 'screenshot' ? 'sms' : initialType);
  const [languageOverride, setLanguageOverride] = useState<'auto' | SupportedLanguage>('auto');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Image Upload State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/png');
  const [imageFileName, setImageFileName] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Helper: De-obfuscation / Quick Slang Explainer
  const [aiClarification, setAiClarification] = useState<string | null>(null);

  const maxChars = 5000;

  const samplePresets = [
    {
      id: 'bisp',
      title: t('presetBisp'),
      type: 'sms' as InputType,
      text: 'Apka Benazir Income Support Program (BISP) 25,000 rupay manzoor ho gaya hai. Abhi rabta karein 0301-4928172 par verification aur transfer ke liye.'
    },
    {
      id: 'bank',
      title: t('presetBank'),
      type: 'sms' as InputType,
      text: 'URGENT: Your HBL online banking access will be suspended within 2 hours due to unverified CNIC. Click http://hbl-security-portal.online to verify your details immediately.'
    },
    {
      id: 'prize',
      title: t('presetPrize'),
      type: 'whatsapp' as InputType,
      text: 'مبارک ہو! آپ کا جیتو پاکستان قرعہ اندازی میں 25 لاکھ روپے کا انعام نکلا ہے۔ انعام وصول کرنے کے لیے فوری طور پر 0321-9876543 پر رابطہ کریں۔'
    },
    {
      id: 'legit_otp',
      title: t('presetLegitOtp'),
      type: 'sms' as InputType,
      text: 'Your verification code is 492810. Valid for 5 minutes. Do not share this code with anyone, including bank representatives.'
    }
  ];

  // Sample screenshot presets
  const sampleImagePresets = [
    {
      id: 'mock_wallet_scam',
      title: '🚨 Fake EasyPaisa Freeze Notice',
      description: 'Fraudulent SMS screenshot with unofficial contact number & threat of freezing funds',
      // Lightweight base64 SVG data URL converted to PNG simulation
      dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAYAAAA+VemSAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHhSURBVHhe7cExAQAAAMKg9U9tCy8gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgIsG1EwAAXN5mSgAAAAASUVORK5CYII='
    },
    {
      id: 'mock_bank_kyc',
      title: '⚠️ Fake Bank Biometric Alert',
      description: 'WhatsApp screenshot claiming CNIC expiration with urgent 2-hour deadline',
      dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAYAAAA+VemSAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHhSURBVHhe7cExAQAAAMKg9U9tCy8gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgIsG1EwAAXN5mSgAAAAASUVORK5CYII='
    }
  ];

  // Clipboard paste listener for images (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (scanMode !== 'image') return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            handleImageFile(file);
            showToast('Image pasted from clipboard.', 'info');
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [scanMode]);

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Image size exceeds 10MB limit.');
      return;
    }

    setImageMimeType(file.type);
    setImageFileName(file.name);
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyPreset = (preset: typeof samplePresets[0]) => {
    setContent(preset.text);
    setInputType(preset.type);
    setErrorMessage(null);
    setAiClarification(null);
  };

  const handleClear = () => {
    setContent('');
    setSelectedImage(null);
    setImageFileName('');
    setErrorMessage(null);
    setAiClarification(null);
  };

  const handleQuickExplainSlang = () => {
    if (!content.trim()) return;
    const lower = content.toLowerCase();
    const explanations: string[] = [];

    if (lower.includes('bisp') || lower.includes('benazir')) {
      explanations.push('• "BISP": Benazir Income Support Program. Official messages arrive exclusively from 8171; personal numbers offering grants are fake.');
    }
    if (lower.includes('jeeto pakistan') || lower.includes('inaam') || lower.includes('qurandazi')) {
      explanations.push('• "Inaam / Qurandazi": Lottery prize lures. Unsolicited lottery wins requiring calls or fees are Advance-Fee 419 scams.');
    }
    if (lower.includes('otp') || lower.includes('pin') || lower.includes('code')) {
      explanations.push('• "OTP / 6-digit code": One-Time Passwords protect your bank accounts. Sharing this code authorizes instant theft.');
    }
    if (lower.includes('block') || lower.includes('band') || lower.includes('suspended')) {
      explanations.push('• "Account Block": Artificial fear tactic to make you panic and click the unverified link.');
    }

    if (explanations.length > 0) {
      setAiClarification(explanations.join('\n'));
    } else {
      setAiClarification('• No specific slang detected. Use "Analyze Security Risk" below for full multi-layer inspection.');
    }
  };

  const handleAnalyzeText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setErrorMessage('Please enter message text or a URL to scan.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    // Multi-tier progress feedback with real-time blacklist query step
    setAnalysisStep('1. Normalizing text, language tokens & extracting URLs...');
    const stepTimer1 = setTimeout(() => {
      setAnalysisStep('2. Querying public threat blacklists (URLhaus, OpenPhish, Spamhaus DBL, ThreatFox)...');
    }, 450);
    const stepTimer2 = setTimeout(() => {
      setAnalysisStep('3. Synthesizing heuristic rules & forensic threat intelligence...');
    }, 950);

    try {
      const response = await fetch('/api/v1/analyses', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          content: content.trim(),
          input_type: inputType,
          language_override: languageOverride === 'auto' ? undefined : languageOverride
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to complete analysis.');
      }

      showToast('Analysis completed successfully.', 'success');
      onAnalysisComplete(data.analysis);
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error occurred during analysis.');
      showToast(err.message || 'Analysis failed.', 'error');
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  const handleAnalyzeImage = async () => {
    if (!selectedImage) {
      setErrorMessage('Please upload or paste a screenshot first.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    setAnalysisStep('1. Extracting text via Gemini Multimodal OCR...');
    const stepTimer1 = setTimeout(() => {
      setAnalysisStep('2. Inspecting counterfeit logos & visual deception markers...');
    }, 600);
    const stepTimer2 = setTimeout(() => {
      setAnalysisStep('3. Running deep forensic fraud assessment...');
    }, 1200);

    try {
      const response = await fetch('/api/v1/ai/scan-image', {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image: selectedImage,
          mimeType: imageMimeType,
          language: languageOverride === 'auto' ? 'en' : languageOverride
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to analyze screenshot.');
      }

      showToast('Gemini Vision analysis completed.', 'success');
      onAnalysisComplete(data.analysis);
    } catch (err: any) {
      setErrorMessage(err.message || 'Image analysis failed.');
      showToast(err.message || 'Image analysis failed.', 'error');
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  return (
    <div className="clay-card p-6 sm:p-8 space-y-6">
      {/* Title & Mode Switcher with Tactile Clay Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 rounded-full text-xs font-bold mb-2 shadow-xs border border-white dark:border-emerald-800/60">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            <span>AI-Powered Multi-Layer Threat Scanner</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            {t('scannerTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-lg">
            {t('scannerSubtitle')}
          </p>

          {/* Primary Scanner Mode Switcher (Clay Pill Switcher) */}
          <div className="mt-4 p-1.5 clay-inset rounded-2xl flex items-center gap-1.5 max-w-md">
            <button
              type="button"
              onClick={() => setScanMode('text')}
              className={`flex-1 py-2 px-3 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 ${
                scanMode === 'text'
                  ? 'clay-pill-active text-emerald-950 dark:text-emerald-300 font-black'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Text / Link Scanner</span>
            </button>
            <button
              type="button"
              onClick={() => setScanMode('image')}
              className={`flex-1 py-2 px-3 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 ${
                scanMode === 'image'
                  ? 'clay-pill-active text-sky-950 dark:text-sky-300 font-black'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-sky-700 dark:text-sky-400" />
              <span>Screenshot OCR (Vision)</span>
            </button>
          </div>
        </div>

        {/* 3D Clay Sticker Accent */}
        <div className="hidden sm:block shrink-0">
          <ClaySticker
            imageSrc={scanMode === 'image' ? STICKER_IMAGES.scannerPhone : STICKER_IMAGES.aiRobotDetective}
            alt={scanMode === 'image' ? 'Clay Scanner Phone' : 'Clay Detective Robot'}
            size="sm"
            rotation={scanMode === 'image' ? 3 : -3}
            badgeText={scanMode === 'image' ? 'VISION OCR' : 'AI GUARD'}
          />
        </div>
      </div>

      {scanMode === 'text' ? (
        <form onSubmit={handleAnalyzeText} className="space-y-6">
          {/* Input Format Selector Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2.5">
              Select Input Medium
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'sms', label: t('inputTypeSms'), icon: PhoneCall },
                { id: 'whatsapp', label: t('inputTypeWhatsapp'), icon: MessageSquare },
                { id: 'email', label: t('inputTypeEmail'), icon: Mail },
                { id: 'url', label: t('inputTypeUrl'), icon: Globe },
              ].map(tab => {
                const Icon = tab.icon;
                const isSelected = inputType === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setInputType(tab.id as InputType)}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-bold transition-all ${
                      isSelected
                        ? 'clay-button-primary'
                        : 'clay-button-secondary'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Textarea with Clay Inset */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="message-input" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Suspicious Message or Link
              </label>
              <div className="flex items-center gap-2.5">
                {/* Language Override */}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  <span>Language:</span>
                  <select
                    value={languageOverride}
                    onChange={(e) => setLanguageOverride(e.target.value as any)}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-[11px] text-slate-800 dark:text-slate-200 font-semibold focus:outline-none shadow-2xs"
                  >
                    <option value="auto">{t('languageAuto')}</option>
                    <option value="en">{t('languageEnglish')}</option>
                    <option value="ur">{t('languageUrdu')}</option>
                    <option value="ru">{t('languageRomanUrdu')}</option>
                  </select>
                </div>

                <span className="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500">
                  {content.length}/{maxChars}
                </span>
              </div>
            </div>

            <div className="clay-inset p-3">
              <textarea
                id="message-input"
                rows={5}
                maxLength={maxChars}
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder={
                  inputType === 'url'
                    ? 'https://example-suspicious-portal.com/login'
                    : 'Paste SMS, WhatsApp message, email body, or Urdu text here...'
                }
                className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none resize-y leading-relaxed font-sans"
                dir={languageOverride === 'ur' ? 'rtl' : 'ltr'}
              />
            </div>
          </div>

          {/* AI Slang / Context Explainer */}
          {aiClarification && (
            <div className="p-3.5 bg-sky-50/80 rounded-2xl border border-sky-200/80 text-xs text-sky-950 whitespace-pre-line leading-relaxed shadow-xs">
              <div className="font-bold flex items-center gap-1.5 mb-1 text-sky-900">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>AI Language & Fraud Context:</span>
              </div>
              {aiClarification}
            </div>
          )}

          {/* Quick Presets Carousel */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t('quickPresetsLabel')}
              </span>
              <button
                type="button"
                onClick={handleQuickExplainSlang}
                className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1"
              >
                <Wand2 className="w-3 h-3 text-emerald-700" />
                <span>AI Slang Explainer</span>
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {samplePresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="clay-button-secondary text-left p-2.5 text-[11px] font-semibold text-slate-700 truncate"
                  title={preset.text}
                >
                  <span className="block truncate font-bold">{preset.title}</span>
                  <span className="block text-[10px] text-slate-400 uppercase mt-0.5">{preset.type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Validation Error Message */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-xs text-rose-800 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Step Progress Feedback */}
          {isAnalyzing && (
            <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200/80 text-xs text-emerald-950 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-900">
                <Sparkles className="w-4 h-4 animate-spin text-emerald-700" />
                <span>{analysisStep || t('btnAnalyzing')}</span>
              </div>
              <div className="w-full bg-emerald-200/70 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-700 h-full w-2/3 animate-pulse rounded-full" />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleClear}
              disabled={isAnalyzing || (!content && !errorMessage)}
              className="clay-button-secondary px-4 py-2.5 text-xs font-bold text-slate-600 flex items-center gap-1.5 disabled:opacity-40"
            >
              <Trash2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{t('btnClear')}</span>
            </button>

            <button
              type="submit"
              disabled={isAnalyzing || !content.trim()}
              className="clay-button-primary px-6 py-2.5 text-xs font-black flex items-center gap-2 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-white" />
                  <span>{t('btnAnalyzing')}</span>
                </>
              ) : (
                <>
                  <span>{t('btnAnalyze')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* Image / Screenshot Upload Mode */
        <div className="space-y-6">
          {/* Screenshot Upload Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              const file = e.dataTransfer.files[0];
              if (file) handleImageFile(file);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`clay-card p-8 sm:p-10 text-center cursor-pointer transition-all border-2 border-dashed ${
              isDragOver
                ? 'border-emerald-600 bg-emerald-50/60 scale-[1.01]'
                : 'border-slate-300 hover:border-slate-400'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageFile(file);
              }}
            />

            <div className="w-16 h-16 rounded-3xl bg-sky-50 text-sky-700 flex items-center justify-center mx-auto mb-3 shadow-xs border border-white">
              <Upload className="w-8 h-8 text-sky-600" />
            </div>

            <h3 className="text-sm font-extrabold text-slate-900">
              Drop your WhatsApp / SMS screenshot here
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Click to browse or press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono text-[10px] text-slate-700">Ctrl + V</kbd> anywhere to paste screenshot from clipboard.
            </p>
            <span className="inline-block mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Supports PNG, JPG, WEBP (Up to 10MB)
            </span>
          </div>

          {/* Screenshot Preview */}
          {selectedImage && (
            <div className="clay-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-bold text-slate-800">
                    {imageFileName || 'Pasted Screenshot Ready'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(null);
                    setImageFileName('');
                  }}
                  className="text-xs text-rose-600 hover:text-rose-800 font-bold"
                >
                  Remove
                </button>
              </div>

              <div className="clay-inset p-2 max-h-72 overflow-hidden flex items-center justify-center rounded-2xl bg-slate-900/5">
                <img
                  src={selectedImage}
                  alt="Scam screenshot preview"
                  referrerPolicy="no-referrer"
                  className="max-h-64 rounded-xl object-contain shadow-xs"
                />
              </div>
            </div>
          )}

          {/* Sample Preset Screenshots */}
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Or Try A Preset Scam Screenshot
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sampleImagePresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setSelectedImage(preset.dataUrl);
                    setImageFileName(preset.title);
                    setErrorMessage(null);
                  }}
                  className="clay-button-secondary p-3.5 text-left flex flex-col justify-between gap-1 transition-all"
                >
                  <span className="text-xs font-extrabold text-slate-900">
                    {preset.title}
                  </span>
                  <span className="text-[11px] text-slate-500 leading-relaxed">
                    {preset.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Validation Error Message */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-xs text-rose-800 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Step Progress Feedback */}
          {isAnalyzing && (
            <div className="p-4 bg-sky-50/80 rounded-2xl border border-sky-200/80 text-xs text-sky-950 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sky-900">
                <Sparkles className="w-4 h-4 animate-spin text-sky-600" />
                <span>{analysisStep || 'Analyzing screenshot with Gemini Multimodal Vision...'}</span>
              </div>
              <div className="w-full bg-sky-200/70 h-2 rounded-full overflow-hidden">
                <div className="bg-sky-700 h-full w-3/4 animate-pulse rounded-full" />
              </div>
            </div>
          )}

          {/* Image Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleClear}
              disabled={isAnalyzing || !selectedImage}
              className="clay-button-secondary px-4 py-2.5 text-xs font-bold text-slate-600 flex items-center gap-1.5 disabled:opacity-40"
            >
              <Trash2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{t('btnClear')}</span>
            </button>

            <button
              type="button"
              onClick={handleAnalyzeImage}
              disabled={isAnalyzing || !selectedImage}
              className="clay-button-accent px-6 py-2.5 text-xs font-black flex items-center gap-2 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-white" />
                  <span>Inspecting Screenshot...</span>
                </>
              ) : (
                <>
                  <span>Scan Screenshot with Gemini AI</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
