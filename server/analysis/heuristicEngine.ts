/**
 * Deterministic Heuristic Rules Engine
 * Evaluates suspicious indicators across English, Urdu, and Roman Urdu.
 * Provides transparent evidence, psychological tactic analysis, and risk scoring.
 */

export interface DetectedIndicator {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  evidence: string;
  weight: number;
}

export interface HeuristicAnalysisOutput {
  riskScore: number;
  riskLevel: 'low' | 'elevated' | 'high' | 'critical';
  indicators: DetectedIndicator[];
  tactics: string[];
  recommendations: string[];
  explanation: string;
  isLegitimatePattern: boolean;
}

interface HeuristicRule {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  weight: number;
  patterns: RegExp[];
  languages: Array<'en' | 'ur' | 'ru'>;
}

const RULES: HeuristicRule[] = [
  // 1. Credential & OTP Harvesting
  {
    id: 'rule_otp_harvesting',
    title: 'Explicit Request for One-Time Password (OTP) or PIN',
    description: 'Solicits temporary security verification codes, secret passwords, or transaction PINs. Legitimate institutions never ask users to send back OTPs.',
    severity: 'critical',
    category: 'Credential Harvesting',
    weight: 45,
    patterns: [
      /(?:send|share|reply|provide|enter|submit|sms)\s+(?:your\s+)?(?:otp|one[- ]time[- ]password|pin|6[- ]digit|secret[- ]code)/i,
      /(?:apna|apka)\s+(?:otp|pin|code|password)\s+(?:send|bhejo|share|batayein|karein)/i,
      /(?:او ٹی پی|خفیہ پن|پاس ورڈ|تصدیقی کوڈ)\s*(?:بھیجیں|بتائیں|شئیر کریں)/,
      /(?:verify|confirm)\s+(?:your\s+)?(?:identity|cnic|account)\s+by\s+(?:sending|providing)\s+code/i
    ],
    languages: ['en', 'ru', 'ur']
  },

  // 2. Artificial Urgency & Account Suspension Threats
  {
    id: 'rule_account_threat',
    title: 'Manufactured Urgency & Account Suspension Threat',
    description: 'Pressures the recipient with imminent account termination, legal repercussions, or service disruption to force immediate compliance without critical reflection.',
    severity: 'high',
    category: 'Psychological Coercion',
    weight: 35,
    patterns: [
      /(?:account|card|access|service|sim)\s+(?:will be\s+)?(?:suspended|blocked|terminated|frozen|closed)(?:\s+(?:today|immediately|fauran|within\s+\d+\s*(?:hours|minutes|days|hrs|mins)))?/i,
      /(?:urgent|alert):\s+(?:your\s+)?(?:account|card|access)\s+(?:will be\s+)?(?:suspended|blocked|closed)/i,
      /(?:account|sim)\s+(?:block|band|muatal)\s+ho\s+(?:jayega|raha hai|chuka)/i,
      /(?:اکاؤنٹ|سم|بینک کارڈ)\s*(?:بند|معطل|بلاک)\s*(?:ہو جائے گا|ہونے والا ہے)/,
      /(?:legal action|police case|arrest warrant|court notice)\s+(?:against you|will be taken)/i,
      /(?:police case|adalat|case darj)\s+(?:ho raha|karwaya jayega)/i
    ],
    languages: ['en', 'ru', 'ur']
  },

  // 3. Government Relief & Public Scheme Impersonation (BISP, Ehsaas, 8171)
  {
    id: 'rule_bisp_ehsaas_fraud',
    title: 'Government Relief Fund Impersonation (BISP / Ehsaas)',
    description: 'Falsely claims approval or pending disbursement for Benazir Income Support Program (BISP) or Ehsaas emergency cash via unauthorized phone numbers.',
    severity: 'critical',
    category: 'Authority Impersonation',
    weight: 45,
    patterns: [
      /(?:benazir|bisp|ehsaas|ehsas)\s+(?:income|program|kifalat|scheme|relief|fund|cash|imdad)/i,
      /(?:بینظیر انکم|احساس پروگرام|کفالت پروگرام|امداد کی رقم)/,
      /(?:bisp|ehsas|benazir)\s+(?:ki\s+taraf\s+se|\d+[,0-9]*\s*(?:rupay|rs))/i,
      /(?:8171\s+ke\s+elawa|official\s+bisp)/i
    ],
    languages: ['en', 'ru', 'ur']
  },

  // 4. Lottery, Lucky Draw & Prize Fraud
  {
    id: 'rule_fake_lottery',
    title: 'Unsolicited Prize or Lottery Notification',
    description: 'Claims the recipient has won an unentered lottery, luxury vehicle, gold, or large cash reward (e.g., Jeeto Pakistan, Lucky Draw).',
    severity: 'critical',
    category: 'Advance Fee Fraud',
    weight: 40,
    patterns: [
      /(?:you\s+(?:have\s+)?won|congratulations\s+you\s+won|lucky\s+draw|lottery\s+winner|claimed\s+your\s+prize)/i,
      /(?:inaam|inam|mubarak|jeeto\s+pakistan|qurandazi)\s+(?:mein\s+)?(?:nikla|jeeta|mubarak|pass)/i,
      /(?:قرعہ اندازی|انعام مبارک|لاٹری|جیتو پاکستان|لاکھ روپے کا انعام)/,
      /(?:car|motorcycle|gold|cash\s+prize)\s+(?:won|nikla|manzoor)/i
    ],
    languages: ['en', 'ru', 'ur']
  },

  // 5. Advance Fee / Processing Fee Solicitation
  {
    id: 'rule_advance_fee',
    title: 'Request for Advance Processing / Delivery Fee',
    description: 'Requires the victim to pay an upfront "registration", "tax", "clearance", or "delivery" charge to release a supposedly larger asset or parcel.',
    severity: 'high',
    category: 'Advance Fee Fraud',
    weight: 40,
    patterns: [
      /(?:pay|send|deposit|transfer)\s+(?:processing|delivery|customs|tax|clearance|registration)\s+fee/i,
      /(?:delivery|processing|advance|customs|courier|tax)\s+(?:fee|fees|charges|kharcha)(?:\s+[\w\d]+){0,3}\s+(?:jama|pay|bhejein|send|transfer|dein|karein)/i,
      /(?:pehle|advance|kharcha|fees|tax)\s+(?:[\w\d]+\s+)?(?:jama|pay|bhejein|send|transfer)\s+karein/i,
      /(?:پہلے فیس|ایڈوانس رقم|ڈیلیوری چارجز)\s*(?:جمع کروائیں|ادا کریں)/,
      /(?:unclaimed package|parcel pending)\s+(?:due to\s+)?(?:unpaid fee|small fee)/i
    ],
    languages: ['en', 'ru', 'ur']
  },

  // 6. Financial Institution & Mobile Wallet Impersonation
  {
    id: 'rule_bank_wallet_spoof',
    title: 'Financial Institution or Mobile Wallet Impersonation',
    description: 'Impersonates state financial authorities or major retail banks and mobile money operators (EasyPaisa, JazzCash, SBP, FBR, HBL).',
    severity: 'high',
    category: 'Brand Impersonation',
    weight: 30,
    patterns: [
      /(?:easypaisa|jazzcash|hbl|ubl|meezan|state\s+bank|sbp|fbr)\s+(?:helpline|customer\s+care|verification|security\s+team)/i,
      /(?:ایزی پیسہ|جاز کیش|اسٹیٹ بینک|بینک اکاؤنٹ کی تصدیق)/,
      /(?:biometric\s+verification|cnic\s+update|nadra\s+verification)\s+(?:required|pending)/i,
      /(?:biometric|tasdeeq|cnic\s+update)\s+(?:karein|karwayen)/i
    ],
    languages: ['en', 'ru', 'ur']
  },

  // 7. Unofficial Contact Channels (Personal WhatsApp / Unverified Numbers)
  {
    id: 'rule_unofficial_channel',
    title: 'Directive to Contact Personal Mobile / WhatsApp Number',
    description: 'Instructs recipient to resolve official banking or government disputes via personal WhatsApp or individual mobile numbers rather than authenticated channels.',
    severity: 'medium',
    category: 'Channel Subversion',
    weight: 25,
    patterns: [
      /(?:contact|whatsapp|call|msg)\s+(?:us\s+at\s+)?(?:03\d{2}[- ]?\d{7}|\+92\s*3\d{2}[- ]?\d{7})/i,
      /(?:is\s+number\s+par|whatsapp\s+par)\s+(?:raabta|rabta|call|msg)\s+karein/i,
      /(?:اس نمبر پر رابطہ کریں|واٹس ایپ پر پیغام بھیجیں)/
    ],
    languages: ['en', 'ru', 'ur']
  },

  // 8. Work-From-Home / Task / Crypto Scam
  {
    id: 'rule_job_investment_scam',
    title: 'Unrealistic Work-from-Home or Crypto Investment Bait',
    description: 'Promises guaranteed excessive daily profits for simple tasks (YouTube likes, typing, crypto doubling).',
    severity: 'high',
    category: 'Investment / Employment Scam',
    weight: 30,
    patterns: [
      /(?:earn|make)\s+(?:\$|rs\.?)\s*\d+[,0-9]*\s*(?:daily|per day|hourly)\s+(?:from home|by typing|watching videos)/i,
      /(?:ghar\s+bethe|online\s+kaam)\s+(?:kamayein|pese\s+kamayein|daily\s+income)/i,
      /(?:گھر بیٹھے|آن لائن کمائیں|روزانہ منافع)/,
      /(?:guaranteed\s+crypto\s+profit|double\s+your\s+investment)/i
    ],
    languages: ['en', 'ru', 'ur']
  }
];

// Legitimate transactional OTP patterns (safeguard against false positives on standard system SMS)
const LEGITIMATE_OTP_PATTERNS = [
  /your\s+(?:verification|login|authentication)\s+code\s+is\s+\d{4,8}\.?\s+(?:do not share|valid for)/i,
  /is\s+your\s+(?:one[- ]time[- ]password|otp)\.?\s+(?:use this code|it expires in)/i,
  /do not share this (?:code|otp) with anyone/i
];

export function runHeuristicAnalysis(
  text: string,
  language: 'en' | 'ur' | 'ru',
  urlSuspicionScore = 0,
  urlWarnings: string[] = []
): HeuristicAnalysisOutput {
  if (!text || text.trim().length === 0) {
    return {
      riskScore: 0,
      riskLevel: 'low',
      indicators: [],
      tactics: [],
      recommendations: ['Provide text or a URL to initiate security analysis.'],
      explanation: 'No content was submitted for inspection.',
      isLegitimatePattern: false,
    };
  }

  // Check if it strictly matches standard legitimate transactional notification
  const isLegitimateOtpPattern = LEGITIMATE_OTP_PATTERNS.some(p => p.test(text));
  const hasNoExplicitUrlOrThreat = !/(?:click|link|http|suspension|blocked|band|fines|fee)/i.test(text);

  const matchedIndicators: DetectedIndicator[] = [];
  const tacticsSet = new Set<string>();
  let aggregateWeight = 0;

  for (const rule of RULES) {
    for (const pattern of rule.patterns) {
      const match = text.match(pattern);
      if (match) {
        const evidenceSnippet = match[0].trim();
        matchedIndicators.push({
          id: rule.id,
          title: rule.title,
          description: rule.description,
          severity: rule.severity,
          category: rule.category,
          evidence: evidenceSnippet,
          weight: rule.weight,
        });

        tacticsSet.add(rule.category);
        aggregateWeight += rule.weight;
        break; // Match rule once
      }
    }
  }

  // Factor in URL structural score
  if (urlSuspicionScore > 0) {
    aggregateWeight += Math.round(urlSuspicionScore * 0.45);
    tacticsSet.add('Suspicious URL Engineering');
  }

  // Cap initial score
  let finalScore = Math.min(100, aggregateWeight);

  // If legitimate pattern was matched and NO scam indicators triggered
  if (isLegitimateOtpPattern && matchedIndicators.length === 0 && hasNoExplicitUrlOrThreat) {
    finalScore = 10;
  }

  // Determine risk band
  let riskLevel: 'low' | 'elevated' | 'high' | 'critical' = 'low';
  if (finalScore >= 80) {
    riskLevel = 'critical';
  } else if (finalScore >= 55) {
    riskLevel = 'high';
  } else if (finalScore >= 25) {
    riskLevel = 'elevated';
  } else {
    riskLevel = 'low';
  }

  // Generate actionable safety recommendations
  const recommendations: string[] = [];
  if (riskLevel === 'critical' || riskLevel === 'high') {
    recommendations.push('Do NOT click any links, open attachments, or reply to the message.');
    recommendations.push('Never share OTP codes, banking passwords, PINs, or CNIC details.');
    recommendations.push('If this claimed to be your bank or mobile wallet, call their official verified helpline directly.');
    recommendations.push('Block the sender phone number / email address and report as fraud to your telecom operator.');
  } else if (riskLevel === 'elevated') {
    recommendations.push('Exercise caution. Independently verify the message through the official service app or website.');
    recommendations.push('Do not use phone numbers or web addresses provided inside this unsolicited message.');
  } else {
    recommendations.push('No obvious red flags detected, but maintain general vigilance.');
    recommendations.push('Remember that legitimate organizations never ask for your confidential credentials via message.');
  }

  urlWarnings.forEach(uw => {
    recommendations.push(`URL Alert: ${uw}`);
  });

  // Construct explanation summary
  let explanation = '';
  if (matchedIndicators.length > 0) {
    const topCategories = Array.from(tacticsSet).join(', ');
    explanation = `Identified ${matchedIndicators.length} suspicious indicator(s) involving ${topCategories}. The message exhibits patterns typical of deceptive social engineering.`;
  } else if (isLegitimateOtpPattern && hasNoExplicitUrlOrThreat) {
    explanation = 'This message closely matches standard, automated transactional code delivery without phishing indicators. Ensure you initiated this request yourself.';
  } else {
    explanation = 'No recognized scam markers or malicious link structures were detected. However, absence of detected patterns does not guarantee authenticity.';
  }

  return {
    riskScore: finalScore,
    riskLevel,
    indicators: matchedIndicators,
    tactics: Array.from(tacticsSet),
    recommendations,
    explanation,
    isLegitimatePattern: isLegitimateOtpPattern && matchedIndicators.length === 0,
  };
}
