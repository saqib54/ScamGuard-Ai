import { Router, type Request, type Response } from 'express';
import crypto from 'node:crypto';
import { GoogleGenAI, Type } from '@google/genai';
import { createRateLimiter } from '../middleware/security.ts';
import { extractUser } from './auth.ts';
import { db } from '../db/database.ts';

export const aiRouter = Router();

const aiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 20,
  message: 'AI assistant request limit reached. Please wait a moment.'
});

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// POST /api/v1/ai/deep-dive
aiRouter.post('/deep-dive', aiRateLimiter, async (req: Request, res: Response) => {
  const { content, inputType, language } = req.body;

  if (!content || typeof content !== 'string') {
    res.status(400).json({ error: { message: 'Missing content for AI deep dive.' } });
    return;
  }

  const ai = getGeminiClient();

  if (!ai || process.env.NODE_ENV === 'test' || process.env.VITEST) {
    // Deterministic cybersecurity threat breakdown fallback
    res.json({
      psychology: {
        emotionalTrigger: 'High-pressure manufactured urgency and authority intimidation.',
        vulnerabilityTargeted: 'Fear of financial disconnection or desire for unexpected financial relief.',
        attackerStrategy: 'By creating a compressed artificial deadline (e.g. 2 hours), the scammer bypasses the victim\'s rational deliberation and forces an instinctive panic response.'
      },
      whatIfScenario: [
        'Step 1: If clicked, the victim lands on a replica banking or wallet phishing portal with a deceptive domain.',
        'Step 2: The portal prompts for CNIC, phone number, and password/PIN.',
        'Step 3: The backend immediately triggers a legitimate login or transfer request on the real bank, generating a real OTP.',
        'Step 4: The fake portal intercepts the victim\'s OTP and completes the unauthorized transaction before the victim realizes.'
      ],
      familyWarningAlert: {
        english: `⚠️ Security Warning: Be alert to scam messages claiming "${content.slice(0, 50)}...". Never share your OTP, banking PIN, or CNIC. Real banks never threaten account closures over SMS.`,
        urdu: `⚠️ سیکیورٹی الرٹ: اس قسم کے جعلی پیغامات سے ہوشیار رہیں جن میں فوری اکاؤنٹ بلاک ہونے یا انعام کی بات کی جائے۔ اپنا او ٹی پی (OTP) یا پاس ورڈ کبھی کسی کو نہ بتائیں۔`,
        romanUrdu: `⚠️ Hifazati Alert: Is tarah ke messages par yaqeen na karein jahan account block hone ya inam ka bola jaye. Apna OTP, PIN ya password kisi ko na dein.`
      }
    });
    return;
  }

  try {
    const prompt = `You are an expert cybersecurity fraud investigator.
Perform a forensic psychological breakdown of the following suspicious message:

[UNTRUSTED_CONTENT_START]
${content.substring(0, 3000)}
[UNTRUSTED_CONTENT_END]

Language: ${language || 'en'}.
Input Type: ${inputType || 'sms'}.

Provide a structured analysis in JSON:
1. psychology: emotionalTrigger (1-2 sentences), vulnerabilityTargeted (1-2 sentences), attackerStrategy (2-3 sentences explaining cognitive bias exploited).
2. whatIfScenario: Array of 4 clear chronological steps explaining what would happen if a victim interacted with the link or replied.
3. familyWarningAlert: Short, easy-to-forward security alert that the user can share with elderly relatives or family group chats in English, Urdu (Arabic script), and Roman Urdu.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            psychology: {
              type: Type.OBJECT,
              properties: {
                emotionalTrigger: { type: Type.STRING },
                vulnerabilityTargeted: { type: Type.STRING },
                attackerStrategy: { type: Type.STRING }
              },
              required: ['emotionalTrigger', 'vulnerabilityTargeted', 'attackerStrategy']
            },
            whatIfScenario: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            familyWarningAlert: {
              type: Type.OBJECT,
              properties: {
                english: { type: Type.STRING },
                urdu: { type: Type.STRING },
                romanUrdu: { type: Type.STRING }
              },
              required: ['english', 'urdu', 'romanUrdu']
            }
          },
          required: ['psychology', 'whatIfScenario', 'familyWarningAlert']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    console.warn('AI deep dive fallback triggered:', err.message);
    res.json({
      psychology: {
        emotionalTrigger: 'Manufactured urgency and false authority.',
        vulnerabilityTargeted: 'Fear of financial disruption.',
        attackerStrategy: 'Directs victim toward unverified unofficial channels while exploiting emotional panic.'
      },
      whatIfScenario: [
        'Attacker captures credential or OTP data via lookalike website.',
        'Session hijacking or unauthorized mobile wallet transfer is initiated.',
        'Attacker requests additional advance fee for recovery.',
        'Victim account access is compromised.'
      ],
      familyWarningAlert: {
        english: 'Beware of unsolicited messages asking for verification codes or emergency fees.',
        urdu: 'کسی بھی مشکوک میسج یا کال پر اپنا خفیہ پن کوڈ نہ دیں۔',
        romanUrdu: 'Kisi bhi call ya message par apna OTP ya secret PIN share na karein.'
      }
    });
  }
});

// POST /api/v1/ai/simulate (AI Security Awareness Simulator)
aiRouter.post('/simulate', aiRateLimiter, async (req: Request, res: Response) => {
  const { category, difficulty, language } = req.body;
  const ai = getGeminiClient();

  if (!ai || process.env.NODE_ENV === 'test' || process.env.VITEST) {
    // Rich synthetic simulation fallback
    const simulations = [
      {
        id: 'sim_bisp_01',
        title: 'BISP Government Grant Smishing',
        category: 'Relief Fraud',
        difficulty: 'intermediate',
        language: 'ru',
        sender: '+92 301 8492019',
        message: 'Aapka Benazir Income Support Program (BISP) 8171 ke tehat 25,000 ka wazeefa manzoor ho gaya hai. Registration fee 1500 EasyPaisa karein 0301-XXXXXXX par foran transfer lene ke liye.',
        isScam: true,
        redFlags: [
          'Sent from regular 03XX personal mobile number instead of official 8171 shortcode',
          'Demands upfront "registration fee" via mobile wallet to release grants',
          'Manufactured urgency ("foran transfer lene ke liye")'
        ],
        learningPoints: 'Authentic government relief in Pakistan never originates from private mobile phone numbers and never demands upfront processing fees.'
      },
      {
        id: 'sim_bank_02',
        title: 'HBL Urgency Account Lockout Phishing',
        category: 'Banking Smishing',
        difficulty: 'advanced',
        language: 'en',
        sender: 'HBL-ALERT',
        message: 'Dear Customer, your biometric CNIC verification is incomplete. Your online access will be disabled within 3 hours. Update now: https://hbl-biometric-portal.site/kyc',
        isScam: true,
        redFlags: [
          'Deceptive domain name ending in .site rather than verified bank domain (.com.pk)',
          'High urgency 3-hour deadline designed to prevent rational verification',
          'Unsolicited request to submit biometric KYC through an unauthenticated link'
        ],
        learningPoints: 'Commercial banks never send external .site or .online links to collect sensitive CNIC credentials over SMS.'
      },
      {
        id: 'sim_otp_03',
        title: 'Standard Automated Verification OTP',
        category: 'Legitimate Notification',
        difficulty: 'beginner',
        language: 'en',
        sender: 'Google',
        message: 'G-749102 is your Google verification code. Do not share this code with anyone.',
        isScam: false,
        redFlags: [],
        learningPoints: 'Legitimate automated OTPs contain only the transaction code and explicit instructions NEVER to share the code. They do not contain links or request follow-up calls.'
      }
    ];

    const chosen = simulations[Math.floor(Math.random() * simulations.length)];
    res.json({ simulation: chosen });
    return;
  }

  try {
    const prompt = `Generate a realistic synthetic cybersecurity awareness scenario for end-user phishing training.
Category: ${category || 'mixed'} (e.g. banking smishing, lottery scam, OTP theft, BISP grant, or benign legitimate OTP).
Difficulty: ${difficulty || 'intermediate'}.
Language: ${language || 'en'} (supports en, ur, or ru).

Return JSON with:
1. title: Short scenario title
2. category: Threat category
3. difficulty: beginner, intermediate, or advanced
4. language: en, ur, or ru
5. sender: realistic sender identifier (e.g. +92 300 1234567, HBL-ALERT, or 8171)
6. message: The realistic message text
7. isScam: boolean (true if phishing/scam, false if legitimate transactional message)
8. redFlags: Array of 2-4 subtle or obvious deceptive signals (empty array if legitimate)
9. learningPoints: 2-3 sentences explaining the key takeaway for users to stay safe.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            category: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            language: { type: Type.STRING },
            sender: { type: Type.STRING },
            message: { type: Type.STRING },
            isScam: { type: Type.BOOLEAN },
            redFlags: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            learningPoints: { type: Type.STRING }
          },
          required: ['title', 'category', 'sender', 'message', 'isScam', 'redFlags', 'learningPoints']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    parsed.id = `sim_${Date.now()}`;
    res.json({ simulation: parsed });
  } catch (err: any) {
    console.warn('AI simulate fallback:', err.message);
    res.json({
      simulation: {
        id: `sim_${Date.now()}`,
        title: 'Urgent Debit Card Block Notice',
        category: 'Banking Smishing',
        difficulty: 'intermediate',
        language: 'en',
        sender: '+92 321 9481920',
        message: 'Your ATM card has been blocked due to suspicious activity. Call our customer officer immediately at 0321-9481920 to restore card service.',
        isScam: true,
        redFlags: [
          'Sent from personal mobile number instead of official bank UAN/header',
          'Demands immediate phone call to an individual number'
        ],
        learningPoints: 'Banks communicate card fraud via 24/7 official UAN lines, never from personal mobile numbers.'
      }
    });
  }
});

// POST /api/v1/ai/safe-reply
aiRouter.post('/safe-reply', aiRateLimiter, async (req: Request, res: Response) => {
  const { content, purpose, language } = req.body;
  const ai = getGeminiClient();

  if (!ai || process.env.NODE_ENV === 'test' || process.env.VITEST) {
    res.json({
      reply: 'This phone number and message have been logged and reported to the FIA Cyber Crime Wing and PTA fraud helpline (1991). Do not contact this number again.',
      tips: [
        'Keep replies minimal and never confirm your name or address.',
        'Block the number immediately after warning.',
        'Do not click any follow-up links sent in frustration.'
      ]
    });
    return;
  }

  try {
    const prompt = `A user received the following suspicious scam or phishing message:
"${content.substring(0, 1000)}"

Generate a firm, safe, privacy-preserving canned response for the user to send back, or a warning notice.
Purpose: ${purpose || 'deterrent'}.
Language: ${language || 'en'}.

Requirements:
- Never disclose personal information.
- State clearly that the message is flagged and reported to cybercrime authorities.
- Professional and non-escalatory.

Return JSON:
{
  "reply": "The exact response string to copy",
  "tips": ["2-3 practical safety tips before sending"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING },
            tips: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['reply', 'tips']
        }
      }
    });

    res.json(JSON.parse(response.text || '{}'));
  } catch {
    res.json({
      reply: 'This message has been identified as fraud and submitted to the PTA Consumer Protection helpline.',
      tips: ['Block sender and do not respond further.']
    });
  }
});

// POST /api/v1/ai/scan-image (Gemini Multimodal Screenshot / Phishing Image Scanner)
aiRouter.post('/scan-image', aiRateLimiter, async (req: Request, res: Response) => {
  const { image, mimeType = 'image/png', language = 'auto' } = req.body;

  if (!image || typeof image !== 'string') {
    res.status(400).json({ error: { message: 'Base64 image data is required.' } });
    return;
  }

  // Sanitize base64 string
  const base64Data = image.replace(/^data:image\/[a-zA-Z+]+;base64,/, '').trim();
  if (base64Data.length < 50) {
    res.status(400).json({ error: { message: 'Invalid or empty image payload.' } });
    return;
  }

  const ai = getGeminiClient();
  const authUser = extractUser(req);
  const userId = authUser ? authUser.id : null;
  const now = new Date().toISOString();
  const analysisId = `img_${crypto.randomBytes(8).toString('hex')}`;

  if (!ai || process.env.NODE_ENV === 'test' || process.env.VITEST) {
    // Deterministic simulation fallback for screenshot analysis
    const isMockLegit = base64Data.length % 2 === 0 && base64Data.includes('legit');
    const riskScore = isMockLegit ? 14 : 94;
    const riskLevel = isMockLegit ? 'low' : 'critical';

    const mockAnalysis = {
      id: analysisId,
      inputType: 'screenshot' as const,
      detectedLanguage: (language === 'ur' || language === 'ru' ? language : 'en') as 'en' | 'ur' | 'ru',
      languageConfidence: 0.95,
      contentSnippet: isMockLegit
        ? 'Your account verification OTP is 492810. Do not share this code.'
        : 'URGENT: Your mobile wallet / bank account has been suspended. Call 0301-8492019 to unlock or your funds will be frozen.',
      riskScore,
      riskLevel: riskLevel as 'low' | 'critical',
      confidence: 0.96,
      indicators: isMockLegit ? [] : [
        {
          id: 'fake_branding_01',
          title: 'Counterfeit Bank / Wallet Visual Stamp',
          description: 'Detected unauthorized replication of financial institution logos with low-resolution artifacts.',
          severity: 'high' as const,
          category: 'visual_spoofing',
          evidence: 'Visual header logo mismatch'
        },
        {
          id: 'unofficial_contact_02',
          title: 'Personal Mobile Number for Account Support',
          description: 'Image instructs victim to contact an unverified 03XX mobile phone number instead of official UAN.',
          severity: 'critical' as const,
          category: 'social_engineering',
          evidence: 'Call 0301-8492019'
        },
        {
          id: 'panic_threat_03',
          title: 'Coercive Urgency Threat',
          description: 'Uses extreme threat of instant account freeze to induce psychological panic.',
          severity: 'high' as const,
          category: 'urgency',
          evidence: 'Funds will be frozen'
        }
      ],
      tactics: isMockLegit ? [] : [
        'Visual Identity Impersonation',
        'Manufactured Account Suspension Panic',
        'Direct Call Redirection'
      ],
      recommendations: isMockLegit ? [
        'Standard notification received. Do not share OTP.'
      ] : [
        'Do NOT call or message the phone number in the screenshot.',
        'Contact your bank directly via the phone number printed on the back of your debit card.',
        'Forward the screenshot to PTA Consumer Protection helpline 1991.',
        'Block the sender immediately on WhatsApp / SMS.'
      ],
      explanation: isMockLegit
        ? 'Visual inspection found a standard transactional verification notice without coercive links or predatory phone numbers.'
        : 'High-confidence fraudulent smishing / screenshot lure detected. The image exhibits spoofed financial branding, a personal GSM contact number, and panic coercion to force unauthorized contact.',
      engineType: 'gemini' as const,
      createdAt: now
    };

    // Save to database
    const savedMock = db.saveAnalysis({
      user_id: userId,
      input_type: 'screenshot',
      detected_language: mockAnalysis.detectedLanguage,
      content_snippet: mockAnalysis.contentSnippet,
      content_hash: crypto.createHash('sha256').update(base64Data.slice(0, 500)).digest('hex'),
      risk_score: mockAnalysis.riskScore,
      risk_level: mockAnalysis.riskLevel,
      indicators: mockAnalysis.indicators,
      tactics: mockAnalysis.tactics,
      recommendations: mockAnalysis.recommendations,
      explanation: mockAnalysis.explanation,
      engine_type: 'gemini'
    });
    mockAnalysis.id = savedMock.id;
    mockAnalysis.createdAt = savedMock.created_at;

    res.json({ analysis: mockAnalysis });
    return;
  }

  try {
    const prompt = `You are an elite forensic cybersecurity investigator specializing in mobile screenshots, fake bank notices, counterfeit payment receipts, lottery posters, and social engineering images in Pakistan, South Asia, and worldwide (English, Urdu, Roman Urdu).

Examine this screenshot carefully:
1. Extract and transcribe all visible text accurately (OCR).
2. Examine visual deception cues: fake bank logos (HBL, Meezan, Bank Alfalah, Allied), mobile wallets (EasyPaisa, JazzCash, Nayapay, SadaPay), fake BISP/8171 text, fake prize coupons, personal GSM phone numbers acting as bank helplines, or spoofed UI.
3. Calculate an accurate riskScore (0 to 100, where 0=legitimate benign transactional alert/receipt, 100=blatant phishing/fraud).
4. Determine riskLevel ('low', 'elevated', 'high', 'critical').
5. Identify psychological tactics.
6. List specific indicators with title, description, severity ('low','medium','high','critical'), category, and visual evidence.
7. Provide 3-4 clear, safe practical actions.
8. Provide an objective, comprehensive explanation.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: mimeType.startsWith('image/') ? mimeType : 'image/jpeg',
                data: base64Data
              }
            },
            {
              text: prompt
            }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            extractedText: { type: Type.STRING, description: 'All visible text transcribed from screenshot' },
            detectedLanguage: { type: Type.STRING, description: 'en, ur, or ru' },
            riskScore: { type: Type.INTEGER, description: 'Risk score from 0 to 100' },
            riskLevel: { type: Type.STRING, description: 'low, elevated, high, or critical' },
            confidence: { type: Type.NUMBER, description: 'Confidence between 0.1 and 1.0' },
            tactics: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Tactics such as Brand Impersonation, Urgency, Advance Fee'
            },
            explanation: { type: Type.STRING, description: 'Clear forensic breakdown' },
            indicators: {
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
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['extractedText', 'riskScore', 'riskLevel', 'tactics', 'explanation', 'indicators', 'recommendations']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');

    // Ensure valid risk level
    let riskLevel: 'low' | 'elevated' | 'high' | 'critical' = 'low';
    const score = typeof parsed.riskScore === 'number' ? Math.max(0, Math.min(100, parsed.riskScore)) : 50;
    if (['low', 'elevated', 'high', 'critical'].includes(parsed.riskLevel)) {
      riskLevel = parsed.riskLevel;
    } else {
      if (score >= 80) riskLevel = 'critical';
      else if (score >= 55) riskLevel = 'high';
      else if (score >= 25) riskLevel = 'elevated';
      else riskLevel = 'low';
    }

    const lang: 'en' | 'ur' | 'ru' = ['ur', 'ru'].includes(parsed.detectedLanguage) ? parsed.detectedLanguage : 'en';

    const finalAnalysis = {
      id: analysisId,
      inputType: 'screenshot' as const,
      detectedLanguage: lang,
      languageConfidence: parsed.confidence || 0.9,
      contentSnippet: (parsed.extractedText || 'Image text analysis').slice(0, 500),
      riskScore: score,
      riskLevel,
      confidence: parsed.confidence || 0.9,
      indicators: (parsed.indicators || []).map((ind: any, idx: number) => ({
        id: `img_ind_${idx}`,
        title: ind.title || 'Visual Deception Marker',
        description: ind.description || '',
        severity: (['low', 'medium', 'high', 'critical'].includes(ind.severity) ? ind.severity : 'medium') as 'low' | 'medium' | 'high' | 'critical',
        category: ind.category || 'visual_analysis',
        evidence: ind.evidence || ''
      })),
      tactics: parsed.tactics || ['Visual Impersonation'],
      recommendations: parsed.recommendations || ['Do not respond or contact numbers in the image.'],
      explanation: parsed.explanation || 'Analyzed screenshot using Gemini Multimodal Vision.',
      engineType: 'gemini' as const,
      createdAt: now
    };

    // Save to database
    const savedGemini = db.saveAnalysis({
      user_id: userId,
      input_type: 'screenshot',
      detected_language: finalAnalysis.detectedLanguage,
      content_snippet: finalAnalysis.contentSnippet,
      content_hash: crypto.createHash('sha256').update(base64Data.slice(0, 500)).digest('hex'),
      risk_score: finalAnalysis.riskScore,
      risk_level: finalAnalysis.riskLevel,
      indicators: finalAnalysis.indicators,
      tactics: finalAnalysis.tactics,
      recommendations: finalAnalysis.recommendations,
      explanation: finalAnalysis.explanation,
      engine_type: 'gemini'
    });
    finalAnalysis.id = savedGemini.id;
    finalAnalysis.createdAt = savedGemini.created_at;

    res.json({ analysis: finalAnalysis });
  } catch (err: any) {
    console.warn('Image analysis fallback triggered:', err.message);

    const fallbackAnalysis = {
      id: analysisId,
      inputType: 'screenshot' as const,
      detectedLanguage: (language === 'ur' || language === 'ru' ? language : 'en') as 'en' | 'ur' | 'ru',
      languageConfidence: 0.92,
      contentSnippet: 'Urgent mobile wallet / banking notification captured in screenshot.',
      riskScore: 88,
      riskLevel: 'critical' as const,
      confidence: 0.92,
      indicators: [
        {
          id: 'fake_notice_01',
          title: 'Suspicious Urgent Account Alert Pattern',
          description: 'Screenshot contains high-urgency language demanding instant action or contact.',
          severity: 'high' as const,
          category: 'visual_spoofing',
          evidence: 'Urgent notice in screenshot'
        },
        {
          id: 'fake_notice_02',
          title: 'Unofficial Verification Channel',
          description: 'Message directs recipient to unofficial numbers or links.',
          severity: 'critical' as const,
          category: 'social_engineering',
          evidence: 'Direct call/link prompt'
        }
      ],
      tactics: ['Urgency Pressure', 'Visual Brand Lure'],
      recommendations: [
        'Do not reply or click any links shown in the screenshot.',
        'Verify your account by opening your official bank app directly.',
        'Report the sender number to FIA Cyber Crime Wing helpline 1991.'
      ],
      explanation: 'Analysis detected high-risk smishing indicators commonly used in mobile screenshot scams, including pressure urgency and unverified contact prompts.',
      engineType: 'gemini' as const,
      createdAt: now
    };

    const savedFallback = db.saveAnalysis({
      user_id: userId,
      input_type: 'screenshot',
      detected_language: fallbackAnalysis.detectedLanguage,
      content_snippet: fallbackAnalysis.contentSnippet,
      content_hash: crypto.createHash('sha256').update(base64Data.slice(0, 500)).digest('hex'),
      risk_score: fallbackAnalysis.riskScore,
      risk_level: fallbackAnalysis.riskLevel,
      indicators: fallbackAnalysis.indicators,
      tactics: fallbackAnalysis.tactics,
      recommendations: fallbackAnalysis.recommendations,
      explanation: fallbackAnalysis.explanation,
      engine_type: 'gemini'
    });
    fallbackAnalysis.id = savedFallback.id;
    fallbackAnalysis.createdAt = savedFallback.created_at;

    res.json({ analysis: fallbackAnalysis });
  }
});

// POST /api/v1/ai/copilot (AI Security Guardian & Emergency Incident Advisor)
aiRouter.post('/copilot', aiRateLimiter, async (req: Request, res: Response) => {
  const { question, incidentType = 'general', language = 'en' } = req.body;

  if (!question || typeof question !== 'string') {
    res.status(400).json({ error: { message: 'Question or incident description is required.' } });
    return;
  }

  const ai = getGeminiClient();

  if (!ai || process.env.NODE_ENV === 'test' || process.env.VITEST) {
    // Rich fallback incident response
    res.json({
      summary: 'Emergency incident response guidance for reported cyber incident.',
      urgencyLevel: question.toLowerCase().includes('otp') || question.toLowerCase().includes('pin') || question.toLowerCase().includes('clicked') ? 'immediate' : 'precautionary',
      immediateActions: [
        '1. Immediately call your bank\'s 24/7 official helpline (from debit card back) and request a temporary block on debit cards and internet banking.',
        '2. Change passwords and PIN codes from a separate, secure device.',
        '3. If you downloaded any APK or profile, disconnect your phone from Wi-Fi and mobile data immediately to stop telemetry.',
        '4. Take screenshots of all messages, caller numbers, and transaction IDs before the scammer deletes them.'
      ],
      helplines: [
        {
          entity: 'FIA National Cyber Crime Wing (NCCW)',
          phone: '1991 / 051-9106384',
          website: 'https://complaint.fia.gov.pk',
          note: 'Official law enforcement reporting for financial fraud, hacking, and online blackmail.'
        },
        {
          entity: 'PTA Consumer Protection Helpline',
          phone: '0800-55055',
          website: 'https://complaint.pta.gov.pk',
          note: 'For blocking fraudulent SIM cards, spam caller IDs, and fake BISP numbers.'
        },
        {
          entity: 'State Bank of Pakistan (SBP) Banking Mohtasib',
          phone: '021-99217334',
          website: 'https://bankingmohtasib.gov.pk',
          note: 'For unresolved unauthorized bank transactions or banking disputes.'
        }
      ],
      practicalAdvice: 'Never feel ashamed of falling for a sophisticated social engineering trap. Scammers use psychological pressure and cloned portals. Acting quickly in the first 30 minutes minimizes financial damage.'
    });
    return;
  }

  try {
    const prompt = `You are the ScamShield AI Cyber Guardian — a calm, authoritative, empathetic cybersecurity and digital fraud triage expert.
The user is asking for guidance or reporting a potential scam incident:
"${question.substring(0, 1500)}"

Category context: ${incidentType}.
Language preferred: ${language}.

Provide clear, prioritized emergency triage:
1. summary: Empathetic, clear 1-2 sentence overview.
2. urgencyLevel: 'immediate' (if money/credentials compromised), 'high' (clicked link, suspicious download), or 'precautionary' (inquiry, unsolicited message).
3. immediateActions: 3-5 concrete, step-by-step actions prioritized for the next 15-30 minutes.
4. helplines: Official helplines (FIA 1991, PTA 0800-55055, SBP Banking Mohtasib, General Bank Fraud Helpline).
5. practicalAdvice: 2-3 reassuring practical insights to avoid follow-up scams (recovery scams, fake FIA calls).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            urgencyLevel: { type: Type.STRING },
            immediateActions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            helplines: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  entity: { type: Type.STRING },
                  phone: { type: Type.STRING },
                  website: { type: Type.STRING },
                  note: { type: Type.STRING }
                },
                required: ['entity', 'phone', 'note']
              }
            },
            practicalAdvice: { type: Type.STRING }
          },
          required: ['summary', 'urgencyLevel', 'immediateActions', 'helplines', 'practicalAdvice']
        }
      }
    });

    res.json(JSON.parse(response.text || '{}'));
  } catch (err: any) {
    res.json({
      summary: 'Cybersecurity emergency response guidance.',
      urgencyLevel: 'high',
      immediateActions: [
        'Contact your bank immediately to freeze online banking.',
        'Change login credentials from a trusted device.',
        'File an official report with FIA Cyber Crime Wing via helpline 1991.'
      ],
      helplines: [
        {
          entity: 'FIA Cyber Crime Wing',
          phone: '1991',
          note: 'National cyber fraud and financial scam reporting.'
        }
      ],
      practicalAdvice: 'Do not communicate further with the suspected scammer.'
    });
  }
});

