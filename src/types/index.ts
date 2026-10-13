export type RiskLevel = 'low' | 'elevated' | 'high' | 'critical';
export type InputType = 'sms' | 'whatsapp' | 'email' | 'url' | 'screenshot';
export type EngineType = 'hybrid' | 'heuristics' | 'gemini';
export type SupportedLanguage = 'en' | 'ur' | 'ru';

export interface WarningIndicator {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  evidence?: string;
}

export interface UrlInspectionDetails {
  rawUrl?: string;
  hostname?: string;
  protocol?: string;
  isIpAddress?: boolean;
  hasDeceptiveTokens?: boolean;
  warnings: string[];
}

export interface AnalysisResult {
  id: string;
  inputType: InputType;
  detectedLanguage: SupportedLanguage;
  languageConfidence?: number;
  contentSnippet: string;
  riskScore: number;
  riskLevel: RiskLevel;
  confidence?: number;
  indicators: WarningIndicator[];
  tactics: string[];
  recommendations: string[];
  explanation: string;
  urlDetails?: UrlInspectionDetails;
  engineType: EngineType;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'analyst' | 'admin';
}

export interface UserSettings {
  user_id: string;
  retention_days: number;
  auto_delete_low_risk: boolean;
  preferred_language: SupportedLanguage;
  cookie_analytics_consent: boolean;
}

export interface DashboardStats {
  total: number;
  averageRiskScore: number;
  riskDistribution: {
    low: number;
    elevated: number;
    high: number;
    critical: number;
  };
  inputTypeCounts: {
    sms: number;
    whatsapp: number;
    email: number;
    url: number;
  };
  topCategories: Array<{ category: string; count: number }>;
  recentAnalyses: Array<{
    id: string;
    input_type: InputType;
    risk_level: RiskLevel;
    risk_score: number;
    content_snippet: string;
    created_at: string;
  }>;
}
