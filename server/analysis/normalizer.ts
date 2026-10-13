/**
 * Input Normalization and Language Identification Module
 * Sanitizes input text, cleans deceptive unicode tricks, and detects language.
 */

export interface NormalizedInput {
  cleanText: string;
  detectedLanguage: 'en' | 'ur' | 'ru';
  languageConfidence: number;
  extractedUrls: string[];
  hasZeroWidthChars: boolean;
  hasObfuscatedSpacing: boolean;
}

// Urdu Unicode character range (Arabic script used for Urdu)
const URDU_UNICODE_REGEX = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/;

// High-frequency Roman Urdu scam & conversational marker words
const ROMAN_URDU_MARKERS = [
  'apka', 'aapka', 'apko', 'aapko', 'apki', 'aapki', 'mera', 'meri',
  'inaam', 'inam', 'mubarak', 'pese', 'paise', 'rupay', 'rupaye',
  'bisp', 'jeeto', 'lottery', 'qurandazi', 'benazir', 'income', 'support',
  'account', 'band', 'block', 'khatam', 'muatal', 'shuru',
  'karein', 'karo', 'karen', 'bhejo', 'send', 'share', 'batayein', 'bataen',
  'clik', 'click', 'link', 'open', 'rabta', 'raabta', 'call', 'watsap', 'whatsapp',
  'tasdeeq', 'tasdiq', 'hissa', 'jeeta', 'jeeti', 'wali', 'wala', 'waley',
  'police', 'case', 'adalat', 'fauran', 'fouri', 'fauri', 'foran',
  'easypaisa', 'jazzcash', 'hbl', 'ubl', 'meezan', 'bank'
];

export function normalizeInput(rawInput: string): NormalizedInput {
  if (!rawInput || typeof rawInput !== 'string') {
    return {
      cleanText: '',
      detectedLanguage: 'en',
      languageConfidence: 1,
      extractedUrls: [],
      hasZeroWidthChars: false,
      hasObfuscatedSpacing: false,
    };
  }

  // 1. Detect and strip invisible/zero-width unicode characters
  const zeroWidthRegex = /[\u200B-\u200D\uFEFF\u2060\u202A-\u202E]/g;
  const hasZeroWidthChars = zeroWidthRegex.test(rawInput);
  let sanitized = rawInput.replace(zeroWidthRegex, '');

  // 2. Detect artificial excessive spaces between letters (e.g., "P A Y P A L" or "B L O C K")
  const spacingObfuscationRegex = /(?:[a-zA-Z]\s){4,}[a-zA-Z]/;
  const hasObfuscatedSpacing = spacingObfuscationRegex.test(sanitized);

  // 3. Extract any embedded URLs
  const urlRegex = /(?:https?:\/\/|www\.)[^\s<>"{}|\\^`]+|[a-zA-Z0-9-]+\.(?:com|org|net|xyz|online|live|top|site|info|pk|co|biz|vip|link)\b[^\s<>"{}|\\^`]*/gi;
  const extractedUrls: string[] = [];
  const matches = sanitized.match(urlRegex);
  if (matches) {
    matches.forEach(m => {
      let candidate = m.trim().replace(/[.,;!?)]+$/, '');
      if (!candidate.startsWith('http://') && !candidate.startsWith('https://')) {
        candidate = `https://${candidate}`;
      }
      if (!extractedUrls.includes(candidate)) {
        extractedUrls.push(candidate);
      }
    });
  }

  // 4. Normalize multiple spaces and control characters
  sanitized = sanitized.replace(/[\r\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim();

  // 5. Language Detection
  let detectedLanguage: 'en' | 'ur' | 'ru' = 'en';
  let languageConfidence = 0.8;

  // Check Urdu script characters count
  let urduCharCount = 0;
  for (let i = 0; i < sanitized.length; i++) {
    if (URDU_UNICODE_REGEX.test(sanitized[i])) {
      urduCharCount++;
    }
  }

  if (urduCharCount > 4 || (sanitized.length > 0 && urduCharCount / sanitized.length > 0.2)) {
    detectedLanguage = 'ur';
    languageConfidence = Math.min(0.98, urduCharCount / (sanitized.length * 0.5));
  } else {
    // Check Roman Urdu tokens
    const lowerTokens = sanitized.toLowerCase().split(/[\s,.;:!?_/\-()]+/);
    let romanUrduMatches = 0;
    lowerTokens.forEach(t => {
      if (ROMAN_URDU_MARKERS.includes(t)) {
        romanUrduMatches++;
      }
    });

    if (romanUrduMatches >= 2 || (lowerTokens.length <= 6 && romanUrduMatches >= 1)) {
      detectedLanguage = 'ru';
      languageConfidence = Math.min(0.95, 0.5 + romanUrduMatches * 0.15);
    }
  }

  return {
    cleanText: sanitized,
    detectedLanguage,
    languageConfidence,
    extractedUrls,
    hasZeroWidthChars,
    hasObfuscatedSpacing,
  };
}
