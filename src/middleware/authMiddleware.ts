import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: { id: string };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = auth.slice('Bearer '.length);
  try {
    const payload = verifyToken<{ id: string }>(token);
    req.user = { id: payload.id };
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

