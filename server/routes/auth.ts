import { Router, Request, Response } from 'express';
import { db } from '../db/database.ts';
import { createRateLimiter } from '../middleware/security.ts';

export const authRouter = Router();

// Strict rate limit on authentication attempts (10 requests per 5 minutes)
const authLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000,
  maxRequests: 10,
  message: 'Too many authentication attempts. Please try again after a few minutes.'
});

// Helper to extract authenticated user from Authorization header
export function extractUser(req: Request) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7);
  // Token is formatted as usr_... or usr_demo_...
  return db.getUserById(token);
}

// POST /api/v1/auth/register
authRouter.post('/register', authLimiter, (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    res.status(400).json({
      error: { code: 'INVALID_EMAIL', message: 'Please provide a valid email address.' }
    });
    return;
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    res.status(400).json({
      error: { code: 'WEAK_PASSWORD', message: 'Password must be at least 8 characters in length.' }
    });
    return;
  }

  const existing = db.getUserByEmail(email);
  if (existing) {
    res.status(409).json({
      error: { code: 'EMAIL_ALREADY_EXISTS', message: 'An account with this email address already exists.' }
    });
    return;
  }

  const password_hash = db.hashPassword(password);
  const user = db.createUser({
    email,
    password_hash,
    name: name?.trim() || email.split('@')[0],
    role: 'user'
  });

  db.logAudit({
    event_type: 'USER_REGISTERED',
    user_id: user.id,
    ip: req.ip,
    details: { email: user.email }
  });

  res.status(201).json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    token: user.id
  });
});

// POST /api/v1/auth/login
authRouter.post('/login', authLimiter, (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      error: { code: 'MISSING_CREDENTIALS', message: 'Email and password are required.' }
    });
    return;
  }

  const user = db.getUserByEmail(email);
  if (!user || !db.verifyPassword(password, user.password_hash)) {
    db.logAudit({
      event_type: 'FAILED_LOGIN_ATTEMPT',
      ip: req.ip,
      details: { email }
    });

    res.status(401).json({
      error: { code: 'INVALID_CREDENTIALS', message: 'Incorrect email or password.' }
    });
    return;
  }

  db.logAudit({
    event_type: 'USER_LOGIN_SUCCESS',
    user_id: user.id,
    ip: req.ip
  });

  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    token: user.id
  });
});

// GET /api/v1/auth/me
authRouter.get('/me', (req: Request, res: Response) => {
  const user = extractUser(req);
  if (!user) {
    res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Session is invalid or expired.' }
    });
    return;
  }

  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
});

// POST /api/v1/auth/logout
authRouter.post('/logout', (req: Request, res: Response) => {
  const user = extractUser(req);
  if (user) {
    db.logAudit({
      event_type: 'USER_LOGOUT',
      user_id: user.id,
      ip: req.ip
    });
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});
