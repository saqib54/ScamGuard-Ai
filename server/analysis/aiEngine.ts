import { GoogleGenAI, Type } from '@google/genai';

export interface AiAnalysisResult {
  riskScore: number;
  riskLevel: 'low' | 'elevated' | 'high' | 'critical';
  confidence: number;
  tactics: string[];
  explanation: string;
  additionalIndicators: Array<{
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    evidence: string;
  }>;
  tailoredRecommendations: string[];
}

export async function analyzeWithGemini(
  content: string,
  inputType: string,
  detectedLanguage: string
): Promise<AiAnalysisResult | null> {
  if (process.env.NODE_ENV === 'test' || process.env.VITEST) {
    return null; // Deterministic fallback for automated testing
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null; // Gracefully fall back to deterministic heuristics
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt = `You are a cybersecurity scam analysis system.
Examine the following untrusted user-submitted message for scam, phishing, smishing, or fraud indicators.
Language of content: ${detectedLanguage}.
Input format: ${inputType}.

[UNTRUSTED_CONTENT_START]
${content.substring(0, 4000)}
[UNTRUSTED_CONTENT_END]

Evaluate:
1. Is this message attempting social engineering, credential harvesting, lottery scam, BISP fraud, fake bank alerts, or impersonation?
2. Estimate a risk score between 0 and 100 (0=definitely harmless transactional notification, 100=blatant phishing/fraud).
3. Identify psychological tactics used (e.g. Artificial Urgency, Authority Impersonation, Financial Bait).
4. Provide a clear, objective analysis explanation.
5. Provide 2-4 concrete, safe actions for the recipient.`;

    // Timeout guard (4000ms max) to ensure app never hangs
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Gemini API call timed out')), 4000)
    );

    const apiPromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskScore: { type: Type.INTEGER, description: 'Estimated risk score from 0 to 100' },
            riskLevel: { type: Type.STRING, description: 'low, elevated, high, or critical' },
            confidence: { type: Type.NUMBER, description: 'Confidence between 0.1 and 1.0' },
            tactics: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Social engineering and psychological manipulation tactics detected'
            },
            explanation: { type: Type.STRING, description: 'Transparent assessment explanation' },
            additionalIndicators: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  category: { type: Type.STRING },
                  evidence: { type: Type.STRING }
                },
                required: ['title', 'description', 'severity', 'category']
              }
            },
            tailoredRecommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['riskScore', 'riskLevel', 'tactics', 'explanation', 'tailoredRecommendations']
        }
      }
    });

    const response = await Promise.race([apiPromise, timeoutPromise]);
    const text = response.text;
    if (!text) return null;

    const parsed = JSON.parse(text) as AiAnalysisResult;

    // Validate riskLevel enum
    const validLevels = ['low', 'elevated', 'high', 'critical'];
    if (!validLevels.includes(parsed.riskLevel)) {
      if (parsed.riskScore >= 80) parsed.riskLevel = 'critical';
      else if (parsed.riskScore >= 55) parsed.riskLevel = 'high';
      else if (parsed.riskScore >= 25) parsed.riskLevel = 'elevated';
      else parsed.riskLevel = 'low';
    }

    return parsed;
  } catch (err) {
    // Graceful error logging without disrupting user request
    console.warn('AI analysis skipped or fell back to heuristics:', err instanceof Error ? err.message : String(err));
    return null;
  }
}
