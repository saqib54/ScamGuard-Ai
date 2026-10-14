import type { Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';

// In-Memory Rate Limiting
interface RateLimitBucket {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitBucket>();

export function createRateLimiter(options: {
  windowMs: number;
  maxRequests: number;
  message?: string;
}) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
    const key = `${req.baseUrl || ''}:${req.path}:${ip}`;
    const now = Date.now();

    let bucket = rateLimitMap.get(key);
    if (!bucket || bucket.resetAt < now) {
      bucket = {
        count: 1,
        resetAt: now + options.windowMs,
      };
      rateLimitMap.set(key, bucket);
    } else {
      bucket.count++;
    }

    // Set standard rate limit headers
    res.setHeader('X-RateLimit-Limit', options.maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, options.maxRequests - bucket.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(bucket.resetAt / 1000));

    if (bucket.count > options.maxRequests) {
      res.status(429).json({
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: options.message || 'Too many requests. Please wait a moment before trying again.',
          retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
        },
      });
      return;
    }

    next();
  };
}

// Request ID Middleware
export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const reqId = req.headers['x-request-id'] as string || `req_${crypto.randomBytes(8).toString('hex')}`;
  (req as any).id = reqId;
  res.setHeader('X-Request-Id', reqId);
  next();
}

// Centralized Error Handling Middleware
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const reqId = (req as any).id || 'unknown';
  console.error(`[Error] [Request ${reqId}]`, err);

  const statusCode = typeof err.statusCode === 'number' ? err.statusCode : 500;
  const message = statusCode === 500
    ? 'An unexpected error occurred while processing your request. Please try again later.'
    : err.message || 'Operation failed.';

  res.status(statusCode).json({
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message,
      requestId: reqId,
      timestamp: new Date().toISOString(),
    },
  });
}
