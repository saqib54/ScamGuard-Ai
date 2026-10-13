import { Router, Request, Response } from 'express';
import { db } from '../db/database.ts';
import { extractUser } from './auth.ts';

export const settingsRouter = Router();

// GET /api/v1/dashboard/stats
settingsRouter.get('/dashboard/stats', (req: Request, res: Response) => {
  const user = extractUser(req);
  const guestSessionId = req.headers['x-guest-session-id'] as string;
  const userId = user ? user.id : (guestSessionId || null);

  const stats = db.getStats(userId);
  res.json({ stats });
});

// GET /api/v1/settings
settingsRouter.get('/settings', (req: Request, res: Response) => {
  const user = extractUser(req);
  const guestSessionId = req.headers['x-guest-session-id'] as string;
  const userId = user ? user.id : (guestSessionId || 'guest_default');

  const settings = db.getSettings(userId);
  res.json({ settings });
});

// PUT /api/v1/settings
settingsRouter.put('/settings', (req: Request, res: Response) => {
  const user = extractUser(req);
  const guestSessionId = req.headers['x-guest-session-id'] as string;
  const userId = user ? user.id : (guestSessionId || 'guest_default');

  const { retention_days, auto_delete_low_risk, preferred_language, cookie_analytics_consent } = req.body;

  const updated = db.updateSettings(userId, {
    retention_days: typeof retention_days === 'number' ? Math.max(7, Math.min(365, retention_days)) : undefined,
    auto_delete_low_risk: typeof auto_delete_low_risk === 'boolean' ? auto_delete_low_risk : undefined,
    preferred_language: ['en', 'ur', 'ru'].includes(preferred_language) ? preferred_language : undefined,
    cookie_analytics_consent: typeof cookie_analytics_consent === 'boolean' ? cookie_analytics_consent : undefined,
  });

  res.json({ settings: updated, message: 'Settings saved successfully.' });
});

// GET /api/v1/account/export (Data Portability)
settingsRouter.get('/account/export', (req: Request, res: Response) => {
  const user = extractUser(req);
  const guestSessionId = req.headers['x-guest-session-id'] as string;
  const userId = user ? user.id : (guestSessionId || null);

  const analyses = db.getAnalyses({ userId, limit: 1000 }).records;
  const settings = userId ? db.getSettings(userId) : null;

  const exportPayload = {
    exportedAt: new Date().toISOString(),
    user: user ? { id: user.id, email: user.email, name: user.name, role: user.role } : { id: 'guest' },
    settings,
    analyses,
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="scamshield-data-${Date.now()}.json"`);
  res.json(exportPayload);
});
