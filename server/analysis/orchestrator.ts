import crypto from 'node:crypto';
import { normalizeInput } from './normalizer.ts';
import { inspectUrl, type UrlInspectionResult } from './urlInspector.ts';
import { runHeuristicAnalysis, type DetectedIndicator } from './heuristicEngine.ts';
import { analyzeWithGemini } from './aiEngine.ts';
import { checkUrlReputation, type UrlReputationCheckResult } from './urlReputationService.ts';

export interface FullAnalysisResult {
  id: string;
  inputType: 'sms' | 'whatsapp' | 'email' | 'url';
  detectedLanguage: 'en' | 'ur' | 'ru';
  languageConfidence: number;
  contentSnippet: string;
  contentHash: string;
  riskScore: number;
  riskLevel: 'low' | 'elevated' | 'high' | 'critical';
  confidence: number;
  indicators: DetectedIndicator[];
  tactics: string[];
  recommendations: string[];
  explanation: string;
  urlDetails?: UrlInspectionResult;
  urlReputation?: UrlReputationCheckResult;
  engineType: 'hybrid' | 'heuristics' | 'gemini';
  createdAt: string;
}

export async function orchestrateAnalysis(params: {
  content: string;
  inputType: 'sms' | 'whatsapp' | 'email' | 'url';
  languageOverride?: 'auto' | 'en' | 'ur' | 'ru';
}): Promise<FullAnalysisResult> {
  const { content, inputType, languageOverride } = params;

  // 1. Normalize and detect language
  const normalized = normalizeInput(content);
  const detectedLanguage = (languageOverride && languageOverride !== 'auto')
    ? languageOverride
    : normalized.detectedLanguage;

  // 2. Structural URL Inspection & Real-Time Public Blacklist Reputation Check
  let primaryUrlInspection: UrlInspectionResult | undefined;
  let primaryUrlReputation: UrlReputationCheckResult | undefined;
  let urlSuspicionScore = 0;
  let urlWarnings: string[] = [];

  const targetUrls = inputType === 'url' ? [content.trim()] : normalized.extractedUrls;
  if (targetUrls.length > 0) {
    const rawTarget = targetUrls[0];
    primaryUrlInspection = inspectUrl(rawTarget);
    urlSuspicionScore = primaryUrlInspection.suspicionScore;
    urlWarnings = [...primaryUrlInspection.warnings];

    // Real-Time Query against public blacklists (URLhaus, OpenPhish, Spamhaus DBL, ThreatFox, CryptoScamDB)
    try {
      primaryUrlReputation = await checkUrlReputation(rawTarget);
      if (primaryUrlReputation.isBlacklisted) {
        urlSuspicionScore = Math.max(urlSuspicionScore, 85);
        urlWarnings.push(`Listed on public cybersecurity blacklists: ${primaryUrlReputation.summary}`);
      } else if (primaryUrlReputation.overallVerdict === 'suspicious') {
        urlSuspicionScore = Math.max(urlSuspicionScore, 50);
        urlWarnings.push(primaryUrlReputation.summary);
      }
    } catch {
      // Graceful fallback if network is constrained
    }
  }

  // 3. Heuristic Rules Engine
  const heuristics = runHeuristicAnalysis(
    normalized.cleanText,
    detectedLanguage,
    urlSuspicionScore,
    urlWarnings
  );

  // 4. Server-Side AI Analysis (Gemini 3.8 Flash)
  const aiResult = await analyzeWithGemini(
    normalized.cleanText,
    inputType,
    detectedLanguage
  );

  // 5. Synthesis & Aggregation
  let finalScore = heuristics.riskScore;
  let finalLevel = heuristics.riskLevel;
  let engineType: 'hybrid' | 'heuristics' | 'gemini' = 'heuristics';
  let tactics = [...heuristics.tactics];
  const indicators: DetectedIndicator[] = [...heuristics.indicators];
  let recommendations = [...heuristics.recommendations];
  let explanation = heuristics.explanation;
  let confidence = 0.85;

  if (aiResult) {
    engineType = 'hybrid';
    confidence = aiResult.confidence || 0.9;

    // Blend score (give weight to heuristics, adjusted by AI contextual understanding)
    if (heuristics.indicators.length > 0) {
      finalScore = Math.round(heuristics.riskScore * 0.6 + aiResult.riskScore * 0.4);
    } else if (heuristics.isLegitimatePattern) {
      finalScore = Math.min(15, aiResult.riskScore);
    } else {
      finalScore = aiResult.riskScore;
    }

    finalScore = Math.min(100, Math.max(0, finalScore));

    // Recompute level based on blended score
    if (finalScore >= 80) finalLevel = 'critical';
    else if (finalScore >= 55) finalLevel = 'high';
    else if (finalScore >= 25) finalLevel = 'elevated';
    else finalLevel = 'low';

    // Merge AI tactics and indicators
    aiResult.tactics.forEach(t => {
      if (!tactics.includes(t)) tactics.push(t);
    });

    if (Array.isArray(aiResult.additionalIndicators)) {
      aiResult.additionalIndicators.forEach((aiInd, index) => {
        const exists = indicators.some(i => i.title.toLowerCase() === aiInd.title.toLowerCase());
        if (!exists) {
          indicators.push({
            id: `ai_ind_${index}`,
            title: aiInd.title,
            description: aiInd.description,
            severity: (['low', 'medium', 'high', 'critical'].includes(aiInd.severity) ? aiInd.severity : 'medium') as any,
            category: aiInd.category || 'AI Detected Risk',
            evidence: aiInd.evidence || 'Contextual analysis',
            weight: 20
          });
        }
      });
    }

    if (aiResult.tailoredRecommendations.length > 0) {
      recommendations = [
        ...aiResult.tailoredRecommendations,
        ...recommendations.filter(r => !aiResult.tailoredRecommendations.includes(r))
      ];
    }

    if (aiResult.explanation) {
      explanation = aiResult.explanation;
    }
  }

  // 6. Real-Time Public Blacklist Integration
  if (primaryUrlReputation) {
    if (primaryUrlReputation.isBlacklisted) {
      finalScore = Math.max(finalScore, 92);
      finalLevel = 'critical';
      tactics.unshift('Public Cybersecurity Blacklist Match');
      recommendations.unshift('DO NOT OPEN OR CLICK: This link is actively blacklisted on global threat feeds (URLhaus / OpenPhish / Spamhaus).');
      
      const listedSources = primaryUrlReputation.blacklists
        .filter(b => b.status === 'listed')
        .map(b => b.name)
        .join(', ');

      indicators.unshift({
        id: 'ind_blacklist_flagged',
        title: `Flagged on Public Blacklist (${listedSources})`,
        description: primaryUrlReputation.summary,
        severity: 'critical',
        category: 'Public Blacklist Verification',
        evidence: primaryUrlReputation.queriedUrl,
        weight: 60
      });
    } else if (primaryUrlReputation.overallVerdict === 'suspicious') {
      finalScore = Math.min(100, Math.max(finalScore, finalScore + 20));
      if (finalScore >= 80) finalLevel = 'critical';
      else if (finalScore >= 55) finalLevel = 'high';
      else if (finalScore >= 25) finalLevel = 'elevated';

      indicators.push({
        id: 'ind_blacklist_caution',
        title: 'Elevated Threat Signal on Public Blacklists',
        description: primaryUrlReputation.summary,
        severity: 'medium',
        category: 'Public Blacklist Verification',
        evidence: primaryUrlReputation.queriedUrl,
        weight: 25
      });
    }
  }

  // Generate Snippet and Hash for audit trail without storing massive payloads
  const snippet = normalized.cleanText.length > 200
    ? `${normalized.cleanText.substring(0, 197)}...`
    : normalized.cleanText;

  const contentHash = crypto
    .createHash('sha256')
    .update(normalized.cleanText)
    .digest('hex');

  const id = `scan_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

  return {
    id,
    inputType,
    detectedLanguage,
    languageConfidence: normalized.languageConfidence,
    contentSnippet: snippet,
    contentHash,
    riskScore: finalScore,
    riskLevel: finalLevel,
    confidence,
    indicators,
    tactics,
    recommendations,
    explanation,
    urlDetails: primaryUrlInspection,
    urlReputation: primaryUrlReputation,
    engineType,
    createdAt: new Date().toISOString()
  };
}
