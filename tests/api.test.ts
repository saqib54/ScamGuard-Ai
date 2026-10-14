import { describe, it, expect } from 'vitest';
import { db } from '../server/db/database.ts';
import { orchestrateAnalysis } from '../server/analysis/orchestrator.ts';

describe('API & Business Logic Integration', () => {
  it('saves analysis to database and queries history by risk level', async () => {
    const analysis = await orchestrateAnalysis({
      content: 'URGENT: Your bank account will be blocked today unless you click http://suspicious-bank-login.xyz',
      inputType: 'sms'
    });

    const saved = db.saveAnalysis({
      user_id: 'test_integration_user',
      input_type: analysis.inputType,
      detected_language: analysis.detectedLanguage,
      content_snippet: analysis.contentSnippet,
      content_hash: analysis.contentHash,
      risk_score: analysis.riskScore,
      risk_level: analysis.riskLevel,
      indicators: analysis.indicators,
      tactics: analysis.tactics,
      recommendations: analysis.recommendations,
      engine_type: analysis.engineType
    });

    expect(saved.id).toBeDefined();
    expect(saved.risk_score).toBeGreaterThan(50);

    const retrieved = db.getAnalysisById(saved.id, 'test_integration_user');
    expect(retrieved).not.toBeNull();
    expect(retrieved?.id).toBe(saved.id);

    // Cross-user ownership test (unauthorized user cannot retrieve)
    const unauthorized = db.getAnalysisById(saved.id, 'other_unauthorized_user');
    expect(unauthorized).toBeNull();
  });

  it('enforces user ownership when deleting records', () => {
    const record = db.saveAnalysis({
      user_id: 'owner_user_1',
      input_type: 'whatsapp',
      detected_language: 'en',
      content_snippet: 'Test message',
      content_hash: 'hash123',
      risk_score: 20,
      risk_level: 'low',
      indicators: [],
      tactics: [],
      recommendations: [],
      engine_type: 'heuristics'
    });

    // Try deleting as someone else
    const deletedByOther = db.deleteAnalysis(record.id, 'attacker_user');
    expect(deletedByOther).toBe(false);

    // Delete as owner
    const deletedByOwner = db.deleteAnalysis(record.id, 'owner_user_1');
    expect(deletedByOwner).toBe(true);
  });

  it('aggregates dashboard telemetry accurately', () => {
    db.saveAnalysis({
      user_id: 'usr_demo_101',
      input_type: 'sms',
      detected_language: 'en',
      content_snippet: 'Suspicious alert for testing',
      content_hash: 'hash_test_demo_101',
      risk_score: 85,
      risk_level: 'critical',
      indicators: [{ id: 'urgency_1', title: 'Urgency Coercion', description: 'Urgent demand detected', severity: 'critical', category: 'urgency' }],
      tactics: ['Urgency coercion'],
      recommendations: ['Do not click'],
      engine_type: 'heuristics'
    });

    const stats = db.getStats('usr_demo_101');
    expect(stats.total).toBeGreaterThan(0);
    expect(stats.riskDistribution).toHaveProperty('critical');
    expect(stats.riskDistribution).toHaveProperty('low');
    expect(stats.topCategories.length).toBeGreaterThan(0);
  });

  it('handles user registration and password verification securely', () => {
    const testEmail = `tester_${Date.now()}@example.com`;
    const password = 'StrongPassword99!';
    const password_hash = db.hashPassword(password);

    const user = db.createUser({
      email: testEmail,
      password_hash,
      name: 'Integration Tester',
      role: 'user'
    });

    expect(user.id).toBeDefined();
    expect(db.verifyPassword(password, user.password_hash)).toBe(true);
    expect(db.verifyPassword('WrongPassword!', user.password_hash)).toBe(false);
  });

  it('supports screenshot input_type in database persistence', () => {
    const record = db.saveAnalysis({
      user_id: 'test_screenshot_user',
      input_type: 'screenshot',
      detected_language: 'en',
      content_snippet: 'Detected fake bank alert in screenshot',
      content_hash: 'hash_screenshot_123',
      risk_score: 95,
      risk_level: 'critical',
      indicators: [
        {
          id: 'fake_logo_01',
          title: 'Counterfeit Bank Logo',
          description: 'Visual logo impersonation detected.',
          severity: 'high',
          category: 'visual_spoofing'
        }
      ],
      tactics: ['Visual Identity Impersonation'],
      recommendations: ['Do not call the phone number in image.'],
      engine_type: 'gemini'
    });

    expect(record.id).toBeDefined();
    expect(record.input_type).toBe('screenshot');
    expect(record.risk_score).toBe(95);

    const queried = db.getAnalysisById(record.id, 'test_screenshot_user');
    expect(queried).not.toBeNull();
    expect(queried?.input_type).toBe('screenshot');
  });
});

