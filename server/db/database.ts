import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export interface UserRecord {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: 'user' | 'analyst' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface AnalysisRecord {
  id: string;
  user_id: string | null;
  input_type: 'sms' | 'whatsapp' | 'email' | 'url' | 'screenshot';
  detected_language: string;
  content_snippet: string;
  content_hash: string;
  risk_score: number;
  risk_level: 'low' | 'elevated' | 'high' | 'critical';
  indicators: Array<{
    id: string;
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    evidence?: string;
  }>;
  tactics: string[];
  recommendations: string[];
  explanation?: string;
  url_details?: {
    rawUrl?: string;
    hostname?: string;
    protocol?: string;
    isIpAddress?: boolean;
    hasDeceptiveTokens?: boolean;
    warnings: string[];
  };
  url_reputation?: any;
  engine_type: 'hybrid' | 'heuristics' | 'gemini';
  created_at: string;
}

export interface FeedbackRecord {
  id: string;
  analysis_id: string;
  user_id: string | null;
  rating: 'accurate' | 'inaccurate' | 'needs_improvement';
  comment: string;
  created_at: string;
}

export interface UserSettingsRecord {
  user_id: string;
  retention_days: number;
  auto_delete_low_risk: boolean;
  preferred_language: 'en' | 'ur' | 'ru';
  cookie_analytics_consent: boolean;
  updated_at: string;
}

export interface AuditLogRecord {
  id: string;
  event_type: string;
  user_id: string | null;
  ip_hash: string;
  details: Record<string, unknown>;
  created_at: string;
}

// In-memory + persisted storage engine with relational queries
class DatabaseService {
  private dataDir: string;
  private dbFile: string;
  private users: Map<string, UserRecord> = new Map();
  private analyses: Map<string, AnalysisRecord> = new Map();
  private feedback: Map<string, FeedbackRecord> = new Map();
  private settings: Map<string, UserSettingsRecord> = new Map();
  private auditLogs: AuditLogRecord[] = [];

  constructor() {
    const isServerless = !!(process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT);
    this.dataDir = isServerless ? '/tmp/.data' : path.resolve(process.cwd(), '.data');
    this.dbFile = path.join(this.dataDir, 'scamshield_store.json');
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }

      if (fs.existsSync(this.dbFile)) {
        const raw = fs.readFileSync(this.dbFile, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.users)) {
          parsed.users.forEach((u: UserRecord) => this.users.set(u.id, u));
        }
        if (Array.isArray(parsed.analyses)) {
          parsed.analyses.forEach((a: AnalysisRecord) => this.analyses.set(a.id, a));
        }
        if (Array.isArray(parsed.feedback)) {
          parsed.feedback.forEach((f: FeedbackRecord) => this.feedback.set(f.id, f));
        }
        if (Array.isArray(parsed.settings)) {
          parsed.settings.forEach((s: UserSettingsRecord) => this.settings.set(s.user_id, s));
        }
        if (Array.isArray(parsed.auditLogs)) {
          this.auditLogs = parsed.auditLogs;
        }
      } else {
        // No pre-seeded demo user; genuine registration required first
        // Seed realistic historical public threat intelligence records for threat landscape metrics
        const seedAnalyses: AnalysisRecord[] = [
          {
            id: 'scan_seed_001',
            user_id: null,
            input_type: 'sms',
            detected_language: 'ru',
            content_snippet: 'Apka Benazir Income Support Program (BISP) 25,000 rupay manzoor ho gaya hai. Abhi rabta karein 0301-XXXXXXX',
            content_hash: crypto.createHash('sha256').update('bisp_sample').digest('hex'),
            risk_score: 92,
            risk_level: 'critical',
            indicators: [
              {
                id: 'ind_gov_bisp',
                title: 'Government Relief Fund Impersonation',
                description: 'Fraudulent claim of Benazir Income Support Program disbursement via unverified mobile number.',
                severity: 'critical',
                category: 'Impersonation',
                evidence: 'Benazir Income Support Program (BISP) 25,000 rupay'
              },
              {
                id: 'ind_unauth_contact',
                title: 'Unsolicited Contact Directive',
                description: 'Directing recipient to contact a personal mobile number rather than official BISP 8171 portal.',
                severity: 'high',
                category: 'Contact Directive',
                evidence: 'Abhi rabta karein 0301'
              }
            ],
            tactics: ['Financial bait', 'Impersonation of public welfare programs', 'Urgency exploitation'],
            recommendations: [
              'Do not call the mobile number provided.',
              'Verify any official BISP assistance strictly via official portal or 8171 SMS shortcode.',
              'Block the sender and report to telecom authority / FIA Cyber Crime Wing.'
            ],
            engine_type: 'hybrid',
            created_at: new Date(Date.now() - 3600000 * 4).toISOString()
          },
          {
            id: 'scan_seed_002',
            user_id: null,
            input_type: 'sms',
            detected_language: 'en',
            content_snippet: 'URGENT: Your HBL online banking access will be suspended within 2 hours. Click http://hbl-security-portal.online to verify your CNIC and OTP.',
            content_hash: crypto.createHash('sha256').update('hbl_sample').digest('hex'),
            risk_score: 96,
            risk_level: 'critical',
            indicators: [
              {
                id: 'ind_otp_phishing',
                title: 'Credential & OTP Harvesting',
                description: 'Explicit request to submit OTP and CNIC through an external unofficial domain.',
                severity: 'critical',
                category: 'Credential Theft',
                evidence: 'verify your CNIC and OTP'
              },
              {
                id: 'ind_urgency_threat',
                title: 'Artificial Urgency Threat',
                description: 'Manufactured deadline of 2 hours designed to induce panic and bypass critical thinking.',
                severity: 'high',
                category: 'Social Engineering',
                evidence: 'suspended within 2 hours'
              },
              {
                id: 'ind_domain_spoof',
                title: 'Deceptive Lookalike Domain',
                description: 'Hostname "hbl-security-portal.online" impersonates Habib Bank Limited.',
                severity: 'critical',
                category: 'Typosquatting',
                evidence: 'http://hbl-security-portal.online'
              }
            ],
            tactics: ['Urgent panic inducement', 'Banking brand spoofing', 'OTP credential theft'],
            recommendations: [
              'Never share OTPs, PINs, or CNIC numbers on links received via SMS.',
              'Access bank services only through the official mobile banking app or confirmed domain.',
              'Immediately contact bank customer support if any information was entered.'
            ],
            url_details: {
              rawUrl: 'http://hbl-security-portal.online',
              hostname: 'hbl-security-portal.online',
              protocol: 'http:',
              isIpAddress: false,
              hasDeceptiveTokens: true,
              warnings: ['Insecure HTTP protocol used for purported banking portal', 'Deceptive brand token "hbl" registered on untrusted .online TLD']
            },
            engine_type: 'hybrid',
            created_at: new Date(Date.now() - 3600000 * 24).toISOString()
          },
          {
            id: 'scan_seed_003',
            user_id: null,
            input_type: 'sms',
            detected_language: 'en',
            content_snippet: 'Your verification code is 492810. Valid for 5 minutes. Do not share this code with anyone, including bank representatives.',
            content_hash: crypto.createHash('sha256').update('legit_otp').digest('hex'),
            risk_score: 12,
            risk_level: 'low',
            indicators: [],
            tactics: ['Standard automated transaction authentication'],
            recommendations: [
              'This message matches the pattern of a legitimate automated OTP notification.',
              'Ensure you initiated this request yourself.',
              'Never disclose this code to anyone who calls or messages asking for it.'
            ],
            engine_type: 'heuristics',
            created_at: new Date(Date.now() - 3600000 * 48).toISOString()
          }
        ];

        seedAnalyses.forEach(a => this.analyses.set(a.id, a));
        this.persist();
      }
    } catch (err) {
      console.error('Database initialization warning:', err);
    }
  }

  private persist() {
    try {
      const payload = {
        users: Array.from(this.users.values()),
        analyses: Array.from(this.analyses.values()),
        feedback: Array.from(this.feedback.values()),
        settings: Array.from(this.settings.values()),
        auditLogs: this.auditLogs.slice(-1000)
      };
      fs.writeFileSync(this.dbFile, JSON.stringify(payload, null, 2), 'utf-8');
    } catch (err) {
      console.error('Database persist error:', err);
    }
  }

  // Password Utility
  public hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
  }

  public verifyPassword(password: string, storedHash: string): boolean {
    const [salt, originalHash] = storedHash.split(':');
    if (!salt || !originalHash) return false;
    const computed = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(originalHash));
  }

  // User Operations
  public createUser(user: Omit<UserRecord, 'id' | 'created_at' | 'updated_at'>): UserRecord {
    const id = `usr_${crypto.randomUUID()}`;
    const now = new Date().toISOString();
    const record: UserRecord = {
      id,
      ...user,
      created_at: now,
      updated_at: now
    };
    this.users.set(id, record);
    this.persist();
    return record;
  }

  public getUserByEmail(email: string): UserRecord | null {
    const normalized = email.trim().toLowerCase();
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === normalized) {
        return user;
      }
    }
    return null;
  }

  public getUserById(id: string): UserRecord | null {
    return this.users.get(id) || null;
  }

  // Analysis Operations
  public saveAnalysis(analysis: Omit<AnalysisRecord, 'id' | 'created_at'>): AnalysisRecord {
    const id = `scan_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const record: AnalysisRecord = {
      id,
      ...analysis,
      created_at: new Date().toISOString()
    };
    this.analyses.set(id, record);
    this.persist();
    return record;
  }

  public getAnalyses(filter: {
    userId?: string | null;
    riskLevel?: string;
    inputType?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): { records: AnalysisRecord[]; total: number } {
    let list = Array.from(this.analyses.values());

    if (filter.userId !== undefined) {
      list = list.filter(a => a.user_id === filter.userId);
    }

    if (filter.riskLevel && filter.riskLevel !== 'all') {
      list = list.filter(a => a.risk_level === filter.riskLevel);
    }

    if (filter.inputType && filter.inputType !== 'all') {
      list = list.filter(a => a.input_type === filter.inputType);
    }

    if (filter.search && filter.search.trim()) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(a =>
        a.content_snippet.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        a.indicators.some(i => i.title.toLowerCase().includes(q) || i.category.toLowerCase().includes(q))
      );
    }

    // Sort descending by created_at
    list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const total = list.length;
    const offset = Math.max(0, filter.offset || 0);
    const limit = Math.max(1, Math.min(100, filter.limit || 10));
    const records = list.slice(offset, offset + limit);

    return { records, total };
  }

  public getAnalysisById(id: string, userId?: string | null): AnalysisRecord | null {
    const record = this.analyses.get(id);
    if (!record) return null;
    if (userId !== undefined && record.user_id !== userId) {
      return null; // Enforce authorization & record ownership
    }
    return record;
  }

  public deleteAnalysis(id: string, userId?: string | null): boolean {
    const record = this.analyses.get(id);
    if (!record) return false;
    if (userId !== undefined && record.user_id !== userId) {
      return false; // Forbidden
    }
    this.analyses.delete(id);
    this.persist();
    return true;
  }

  public clearAllAnalyses(userId?: string | null): number {
    let count = 0;
    for (const [id, record] of this.analyses.entries()) {
      if (userId === undefined || record.user_id === userId) {
        this.analyses.delete(id);
        count++;
      }
    }
    this.persist();
    return count;
  }

  // Feedback Operations
  public saveFeedback(feedback: Omit<FeedbackRecord, 'id' | 'created_at'>): FeedbackRecord {
    const id = `fdbk_${crypto.randomUUID()}`;
    const record: FeedbackRecord = {
      id,
      ...feedback,
      created_at: new Date().toISOString()
    };
    this.feedback.set(id, record);
    this.persist();
    return record;
  }

  // Settings Operations
  public getSettings(userId: string): UserSettingsRecord {
    const existing = this.settings.get(userId);
    if (existing) return existing;
    const defaultSettings: UserSettingsRecord = {
      user_id: userId,
      retention_days: 90,
      auto_delete_low_risk: false,
      preferred_language: 'en',
      cookie_analytics_consent: false,
      updated_at: new Date().toISOString()
    };
    this.settings.set(userId, defaultSettings);
    this.persist();
    return defaultSettings;
  }

  public updateSettings(userId: string, updates: Partial<UserSettingsRecord>): UserSettingsRecord {
    const current = this.getSettings(userId);
    const updated: UserSettingsRecord = {
      ...current,
      ...updates,
      user_id: userId,
      updated_at: new Date().toISOString()
    };
    this.settings.set(userId, updated);
    this.persist();
    return updated;
  }

  // Dashboard Aggregations
  public getStats(userId?: string | null) {
    let list = Array.from(this.analyses.values());
    if (userId !== undefined) {
      list = list.filter(a => a.user_id === userId);
    }

    const total = list.length;
    const riskDistribution = {
      low: 0,
      elevated: 0,
      high: 0,
      critical: 0
    };

    const categoryCounts: Record<string, number> = {};
    const inputTypeCounts: Record<string, number> = {
      sms: 0,
      whatsapp: 0,
      email: 0,
      url: 0
    };

    let totalScore = 0;

    list.forEach(a => {
      riskDistribution[a.risk_level] = (riskDistribution[a.risk_level] || 0) + 1;
      inputTypeCounts[a.input_type] = (inputTypeCounts[a.input_type] || 0) + 1;
      totalScore += a.risk_score;

      a.indicators.forEach(i => {
        categoryCounts[i.category] = (categoryCounts[i.category] || 0) + 1;
      });
    });

    const averageRiskScore = total > 0 ? Math.round(totalScore / total) : 0;

    const topCategories = Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const recentAnalyses = list
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);

    return {
      total,
      averageRiskScore,
      riskDistribution,
      inputTypeCounts,
      topCategories,
      recentAnalyses
    };
  }

  // Audit Log
  public logAudit(event: {
    event_type: string;
    user_id?: string | null;
    ip?: string;
    details?: Record<string, unknown>;
  }) {
    const ip_hash = event.ip
      ? crypto.createHash('sha256').update(event.ip).digest('hex').substring(0, 16)
      : 'unknown';
    const entry: AuditLogRecord = {
      id: `aud_${crypto.randomUUID()}`,
      event_type: event.event_type,
      user_id: event.user_id || null,
      ip_hash,
      details: event.details || {},
      created_at: new Date().toISOString()
    };
    this.auditLogs.push(entry);
    if (this.auditLogs.length % 20 === 0) {
      this.persist();
    }
  }
}

export const db = new DatabaseService();
