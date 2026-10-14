import { Router, type Request, type Response } from 'express';
import { checkUrlReputation } from '../analysis/urlReputationService.ts';
import { createRateLimiter } from '../middleware/security.ts';

export const reputationRouter = Router();

const reputationLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 40,
  message: 'Reputation check rate limit reached. Please wait a moment before querying again.'
});

// POST /api/v1/reputation/check
reputationRouter.post('/check', reputationLimiter, async (req: Request, res: Response, next) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string' || url.trim().length === 0) {
      res.status(400).json({
        error: { code: 'INVALID_URL', message: 'Please provide a valid URL to query.' }
      });
      return;
    }

    const result = await checkUrlReputation(url.trim());
    res.json({ reputation: result });
  } catch (err) {
    next(err);
  }
});
