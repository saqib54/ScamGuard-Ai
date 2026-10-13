import { Router, Request, Response } from 'express';
import { db } from '../db/database.ts';
import { orchestrateAnalysis } from '../analysis/orchestrator.ts';
import { createRateLimiter } from '../middleware/security.ts';
import { extractUser } from './auth.ts';

export const analysesRouter = Router();

// Rate limiting on analysis execution (30 requests per minute)
const scanLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 30,
  message: 'Scan frequency limit reached. Please wait a few seconds before scanning again.'
});

// POST /api/v1/analyses
analysesRouter.post('/', scanLimiter, async (req: Request, res: Response, next) => {
  try {
    const { content, input_type, language_override } = req.body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      res.status(400).json({
        error: { code: 'INVALID_INPUT', message: 'Please provide message or URL content to analyze.' }
      });
      return;
    }

    if (content.length > 5000) {
      res.status(400).json({
        error: { code: 'CONTENT_TOO_LARGE', message: 'Submitted content exceeds the 5,000 character limit.' }
      });
      return;
    }

    const validTypes = ['sms', 'whatsapp', 'email', 'url'];
    const inputType = validTypes.includes(input_type) ? input_type : 'sms';

    const user = extractUser(req);
    const userId = user ? user.id : (req.headers['x-guest-session-id'] as string) || null;

    // Run full inspection pipeline
    const result = await orchestrateAnalysis({
      content,
      inputType,
      languageOverride: language_override
    });

    // Save record to database
    const saved = db.saveAnalysis({
      user_id: userId,
      input_type: result.inputType,
      detected_language: result.detectedLanguage,
      content_snippet: result.contentSnippet,
      content_hash: result.contentHash,
      risk_score: result.riskScore,
      risk_level: result.riskLevel,
      indicators: result.indicators,
      tactics: result.tactics,
      recommendations: result.recommendations,
      url_details: result.urlDetails ? {
        rawUrl: result.urlDetails.rawUrl,
        hostname: result.urlDetails.hostname,
        protocol: result.urlDetails.protocol,
        isIpAddress: result.urlDetails.isIpAddress,
        hasDeceptiveTokens: result.urlDetails.hasBrandSpoofing || result.urlDetails.hasDeceptiveSubdomains,
        warnings: result.urlDetails.warnings
      } : undefined,
      engine_type: result.engineType
    });

    db.logAudit({
      event_type: 'ANALYSIS_PERFORMED',
      user_id: userId,
      ip: req.ip,
      details: {
        analysisId: saved.id,
        riskScore: saved.risk_score,
        riskLevel: saved.risk_level,
        inputType: saved.input_type,
        engineType: saved.engine_type
      }
    });

    res.status(201).json({
      analysis: {
        id: saved.id,
        inputType: saved.input_type,
        detectedLanguage: saved.detected_language,
        languageConfidence: result.languageConfidence,
        contentSnippet: saved.content_snippet,
        riskScore: saved.risk_score,
        riskLevel: saved.risk_level,
        confidence: result.confidence,
        indicators: saved.indicators,
        tactics: saved.tactics,
        recommendations: saved.recommendations,
        explanation: result.explanation,
        urlDetails: saved.url_details,
        engineType: saved.engine_type,
        createdAt: saved.created_at
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/analyses
analysesRouter.get('/', (req: Request, res: Response) => {
  const user = extractUser(req);
  const guestSessionId = req.headers['x-guest-session-id'] as string;
  const userId = user ? user.id : (guestSessionId || null);

  const { risk_level, input_type, search, page, limit } = req.query;

  const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
  const pageSize = Math.max(1, Math.min(50, parseInt(limit as string, 10) || 10));
  const offset = (pageNum - 1) * pageSize;

  const result = db.getAnalyses({
    userId,
    riskLevel: risk_level as string,
    inputType: input_type as string,
    search: search as string,
    limit: pageSize,
    offset
  });

  res.json({
    records: result.records.map(r => ({
      id: r.id,
      inputType: r.input_type,
      detectedLanguage: r.detected_language,
      contentSnippet: r.content_snippet,
      riskScore: r.risk_score,
      riskLevel: r.risk_level,
      indicatorsCount: r.indicators.length,
      tactics: r.tactics,
      engineType: r.engine_type,
      createdAt: r.created_at
    })),
    pagination: {
      page: pageNum,
      limit: pageSize,
      total: result.total,
      totalPages: Math.ceil(result.total / pageSize)
    }
  });
});

// GET /api/v1/analyses/:id
analysesRouter.get('/:id', (req: Request, res: Response) => {
  const user = extractUser(req);
  const guestSessionId = req.headers['x-guest-session-id'] as string;
  const userId = user ? user.id : (guestSessionId || null);

  const record = db.getAnalysisById(req.params.id, userId);
  if (!record) {
    res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Analysis report not found or access denied.' }
    });
    return;
  }

  res.json({
    analysis: {
      id: record.id,
      inputType: record.input_type,
      detectedLanguage: record.detected_language,
      contentSnippet: record.content_snippet,
      riskScore: record.risk_score,
      riskLevel: record.risk_level,
      indicators: record.indicators,
      tactics: record.tactics,
      recommendations: record.recommendations,
      urlDetails: record.url_details,
      engineType: record.engine_type,
      createdAt: record.created_at
    }
  });
});

// DELETE /api/v1/analyses/:id
analysesRouter.delete('/:id', (req: Request, res: Response) => {
  const user = extractUser(req);
  const guestSessionId = req.headers['x-guest-session-id'] as string;
  const userId = user ? user.id : (guestSessionId || null);

  const deleted = db.deleteAnalysis(req.params.id, userId);
  if (!deleted) {
    res.status(404).json({
      error: { code: 'DELETE_FAILED', message: 'Record not found or unauthorized to delete.' }
    });
    return;
  }

  db.logAudit({
    event_type: 'ANALYSIS_DELETED',
    user_id: userId,
    ip: req.ip,
    details: { analysisId: req.params.id }
  });

  res.json({ success: true, message: 'Analysis record deleted successfully.' });
});

// DELETE /api/v1/analyses (Clear all history)
analysesRouter.delete('/', (req: Request, res: Response) => {
  const user = extractUser(req);
  const guestSessionId = req.headers['x-guest-session-id'] as string;
  const userId = user ? user.id : (guestSessionId || null);

  const count = db.clearAllAnalyses(userId);

  db.logAudit({
    event_type: 'ALL_ANALYSES_CLEARED',
    user_id: userId,
    ip: req.ip,
    details: { recordsDeleted: count }
  });

  res.json({ success: true, deletedCount: count, message: `Successfully deleted ${count} analysis records.` });
});

// POST /api/v1/analyses/:id/feedback
analysesRouter.post('/:id/feedback', (req: Request, res: Response) => {
  const { rating, comment } = req.body;
  const user = extractUser(req);
  const userId = user ? user.id : null;

  const validRatings = ['accurate', 'inaccurate', 'needs_improvement'];
  if (!rating || !validRatings.includes(rating)) {
    res.status(400).json({
      error: { code: 'INVALID_FEEDBACK', message: 'Rating must be accurate, inaccurate, or needs_improvement.' }
    });
    return;
  }

  const feedback = db.saveFeedback({
    analysis_id: req.params.id,
    user_id: userId,
    rating,
    comment: comment?.trim() || ''
  });

  res.status(201).json({ success: true, feedbackId: feedback.id, message: 'Thank you for your feedback.' });
});
