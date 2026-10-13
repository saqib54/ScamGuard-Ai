/**
 * URL Security Inspector Module
 * Safe lexical and structural inspection of URLs without making external HTTP requests.
 * Protects against SSRF, DNS rebinding, internal network scanning, and deceptive domain tricks.
 */

export interface UrlInspectionResult {
  rawUrl: string;
  hostname: string;
  protocol: string;
  port: string;
  pathname: string;
  isIpAddress: boolean;
  isPrivateOrLoopbackIp: boolean;
  isMetadataServiceIp: boolean;
  hasPunycodeOrHomoglyph: boolean;
  hasDeceptiveSubdomains: boolean;
  hasSuspiciousTld: boolean;
  hasBrandSpoofing: boolean;
  spoofedBrand?: string;
  suspicionScore: number;
  warnings: string[];
}

const SUSPICIOUS_TLDS = new Set([
  'xyz', 'top', 'click', 'site', 'online', 'vip', 'link', 'work', 'loan',
  'country', 'kim', 'science', 'gq', 'cf', 'ml', 'tk', 'ga', 'buzz', 'live'
]);

const MONITORED_BRANDS = [
  { name: 'HBL Bank', tokens: ['hbl', 'habibbank'] },
  { name: 'EasyPaisa', tokens: ['easypaisa', 'easy-paisa'] },
  { name: 'JazzCash', tokens: ['jazzcash', 'jazz-cash'] },
  { name: 'UBL Bank', tokens: ['ubl', 'unitedbank'] },
  { name: 'Meezan Bank', tokens: ['meezan', 'meezanbank'] },
  { name: 'State Bank', tokens: ['statebank', 'sbp'] },
  { name: 'PayPal', tokens: ['paypal', 'pay-pal', 'paypa1'] },
  { name: 'Google', tokens: ['google', 'g00gle'] },
  { name: 'Microsoft', tokens: ['microsoft', 'micros0ft'] },
  { name: 'Netflix', tokens: ['netflix', 'netf1ix'] },
  { name: 'Amazon', tokens: ['amazon', 'amaz0n'] },
  { name: 'Apple', tokens: ['apple', 'icloud'] },
  { name: 'WhatsApp', tokens: ['whatsapp', 'watsap'] },
  { name: 'Facebook / Meta', tokens: ['facebook', 'faceb00k'] }
];

export function inspectUrl(rawInput: string): UrlInspectionResult {
  let urlString = rawInput.trim();
  if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
    urlString = `https://${urlString}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(urlString);
  } catch {
    return {
      rawUrl: rawInput,
      hostname: 'invalid-url',
      protocol: '',
      port: '',
      pathname: '',
      isIpAddress: false,
      isPrivateOrLoopbackIp: false,
      isMetadataServiceIp: false,
      hasPunycodeOrHomoglyph: false,
      hasDeceptiveSubdomains: false,
      hasSuspiciousTld: false,
      hasBrandSpoofing: false,
      suspicionScore: 40,
      warnings: ['Malformed or unparseable URL structure'],
    };
  }

  const hostname = parsed.hostname.toLowerCase();
  const protocol = parsed.protocol;
  const warnings: string[] = [];
  let score = 0;

  // 1. Insecure Protocol Check
  if (protocol === 'http:') {
    warnings.push('Unencrypted HTTP protocol used; legitimate sensitive services require HTTPS.');
    score += 15;
  }

  // 2. IP Address Host Check (IPv4 / IPv6 / Hex)
  const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const isIp = ipv4Regex.test(hostname) || hostname.startsWith('[') || /^\d+$/.test(hostname);
  let isPrivateOrLoopback = false;
  let isMetadataService = false;

  if (isIp) {
    warnings.push('Direct IP address used as hostname instead of a verified registered domain.');
    score += 35;

    const match = hostname.match(ipv4Regex);
    if (match) {
      const p1 = parseInt(match[1], 10);
      const p2 = parseInt(match[2], 10);

      // Private IPv4 ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.1)
      if (
        p1 === 10 ||
        (p1 === 172 && p2 >= 16 && p2 <= 31) ||
        (p1 === 192 && p2 === 168) ||
        p1 === 127 ||
        p1 === 0
      ) {
        isPrivateOrLoopback = true;
        warnings.push('Private, loopback, or internal local network IP address detected (SSRF risk).');
        score += 45;
      }

      // Cloud Metadata Service (169.254.169.254)
      if (p1 === 169 && p2 === 254) {
        isMetadataService = true;
        warnings.push('Link targets link-local cloud metadata service (169.254.X.X); typical cloud credential exfiltration target.');
        score += 60;
      }
    }
  }

  // 3. Punycode & Homoglyph spoofing (xn--)
  const hasPunycode = hostname.startsWith('xn--') || hostname.includes('.xn--');
  if (hasPunycode) {
    warnings.push('Internationalized domain name (Punycode "xn--") detected; frequently used for visual character substitution scams.');
    score += 30;
  }

  // 4. Deceptive Subdomains (e.g. paypal.com.security-check.xyz)
  const parts = hostname.split('.');
  const tld = parts.length > 1 ? parts[parts.length - 1] : '';
  const hasSuspiciousTld = SUSPICIOUS_TLDS.has(tld);

  if (hasSuspiciousTld) {
    warnings.push(`Domain uses high-abuse top-level domain (.${tld}) frequently leveraged for disposable phishing sites.`);
    score += 20;
  }

  let hasDeceptiveSubdomains = false;
  if (parts.length > 3) {
    warnings.push(`Excessive subdomain hierarchy (${parts.length} levels); attackers often stack subdomains to disguise the real host.`);
    hasDeceptiveSubdomains = true;
    score += 15;
  }

  // 5. Brand Spoofing / Typosquatting in hostname
  let hasBrandSpoofing = false;
  let spoofedBrand: string | undefined;

  for (const b of MONITORED_BRANDS) {
    for (const token of b.tokens) {
      if (hostname.includes(token)) {
        // Check if it's the official domain
        const isOfficial =
          hostname === `${token}.com` ||
          hostname === `www.${token}.com` ||
          hostname === `${token}.pk` ||
          hostname === `www.${token}.pk` ||
          hostname === `${token}.com.pk` ||
          hostname === `www.${token}.com.pk`;

        if (!isOfficial) {
          hasBrandSpoofing = true;
          spoofedBrand = b.name;
          warnings.push(`Appears to impersonate "${b.name}" within an unofficial domain name ("${hostname}").`);
          score += 40;
          break;
        }
      }
    }
    if (hasBrandSpoofing) break;
  }

  // 6. Suspicious Keywords in Path or Query
  const searchPath = (parsed.pathname + parsed.search).toLowerCase();
  const phishingKeywords = ['login', 'signin', 'verify', 'update', 'secure', 'banking', 'otp', 'password', 'wallet', 'reward'];
  const matchedKeywords = phishingKeywords.filter(k => searchPath.includes(k));
  if (matchedKeywords.length >= 2 && !isIp && !hasBrandSpoofing) {
    warnings.push(`URL path contains multiple credential-related keywords (${matchedKeywords.join(', ')}).`);
    score += 15;
  }

  return {
    rawUrl: rawInput,
    hostname,
    protocol,
    port: parsed.port,
    pathname: parsed.pathname,
    isIpAddress: isIp,
    isPrivateOrLoopbackIp: isPrivateOrLoopback,
    isMetadataServiceIp: isMetadataService,
    hasPunycodeOrHomoglyph: hasPunycode,
    hasDeceptiveSubdomains,
    hasSuspiciousTld,
    hasBrandSpoofing,
    spoofedBrand,
    suspicionScore: Math.min(100, Math.max(0, score)),
    warnings,
  };
}
