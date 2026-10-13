import { describe, it, expect } from 'vitest';
import { normalizeInput } from '../server/analysis/normalizer.ts';
import { inspectUrl } from '../server/analysis/urlInspector.ts';
import { runHeuristicAnalysis } from '../server/analysis/heuristicEngine.ts';

describe('Text Normalizer & Language Detection', () => {
  it('detects Urdu script accurately and normalizes text', () => {
    const raw = 'آپ کا بی آئی ایس پی (BISP) میں 25000 روپیہ منظور ہو گیا ہے۔ فوری رابطہ کریں۔';
    const result = normalizeInput(raw);
    expect(result.detectedLanguage).toBe('ur');
    expect(result.cleanText).toContain('25000');
  });

  it('detects Roman Urdu scam markers accurately', () => {
    const raw = 'Aapka benazir income support program 25000 inaam nikla hai rabta karein';
    const result = normalizeInput(raw);
    expect(result.detectedLanguage).toBe('ru');
  });

  it('extracts embedded URLs without trailing punctuation', () => {
    const raw = 'Check your account status immediately at https://hbl-security.online/verify!';
    const result = normalizeInput(raw);
    expect(result.extractedUrls).toContain('https://hbl-security.online/verify');
  });

  it('strips zero-width unicode characters safely', () => {
    const sneaky = 'S\u200Be\u200Bc\u200Bu\u200Br\u200Be';
    const result = normalizeInput(sneaky);
    expect(result.hasZeroWidthChars).toBe(true);
    expect(result.cleanText).toBe('Secure');
  });
});

describe('URL Structural Inspector (SSRF & Brand Spoofing)', () => {
  it('flags private loopback IP address (SSRF risk)', () => {
    const result = inspectUrl('http://127.0.0.1/admin');
    expect(result.isIpAddress).toBe(true);
    expect(result.isPrivateOrLoopbackIp).toBe(true);
    expect(result.suspicionScore).toBeGreaterThanOrEqual(50);
  });

  it('flags cloud metadata service IP address', () => {
    const result = inspectUrl('http://169.254.169.254/latest/meta-data/');
    expect(result.isMetadataServiceIp).toBe(true);
    expect(result.suspicionScore).toBeGreaterThanOrEqual(70);
  });

  it('detects typosquatting / brand spoofing against major banks and wallets', () => {
    const result = inspectUrl('https://easypaisa-bonus-reward.xyz/claim');
    expect(result.hasBrandSpoofing).toBe(true);
    expect(result.spoofedBrand).toBe('EasyPaisa');
    expect(result.hasSuspiciousTld).toBe(true);
    expect(result.suspicionScore).toBeGreaterThanOrEqual(60);
  });

  it('handles benign legitimate domains safely without throwing', () => {
    const result = inspectUrl('https://google.com/search?q=cybersecurity');
    expect(result.isIpAddress).toBe(false);
    expect(result.isPrivateOrLoopbackIp).toBe(false);
  });
});

describe('Heuristic Rules Engine', () => {
  it('flags OTP harvesting requests with critical score', () => {
    const text = 'Urgent: Please send your 6-digit OTP code to confirm your transaction.';
    const result = runHeuristicAnalysis(text, 'en');
    expect(result.riskScore).toBeGreaterThanOrEqual(45);
    expect(result.indicators.some(i => i.id === 'rule_otp_harvesting')).toBe(true);
  });

  it('recognizes legitimate automated transactional notifications with low risk', () => {
    const text = 'Your verification code is 849102. Valid for 5 minutes. Do not share this code with anyone.';
    const result = runHeuristicAnalysis(text, 'en');
    expect(result.riskScore).toBeLessThanOrEqual(25);
    expect(result.riskLevel).toBe('low');
    expect(result.isLegitimatePattern).toBe(true);
  });

  it('flags Roman Urdu lottery and prize scams', () => {
    const text = 'Mubarak ho! Aapka Jeeto Pakistan mein 50 lakh ka inaam nikla hai. Delivery fee 2000 jama karein.';
    const result = runHeuristicAnalysis(text, 'ru');
    expect(result.riskScore).toBeGreaterThanOrEqual(55);
    expect(result.indicators.some(i => i.id === 'rule_fake_lottery')).toBe(true);
  });

  it('provides safe actions and never claims absolute certainty', () => {
    const text = 'Hello brother, are you free this afternoon for coffee?';
    const result = runHeuristicAnalysis(text, 'en');
    expect(result.riskLevel).toBe('low');
    expect(result.explanation).toContain('does not guarantee');
  });
});
