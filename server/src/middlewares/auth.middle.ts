import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import type { JwtPayload } from '../types/middle';

export function authMiddleware(req: Request ,res: Response,next: NextFunction) {
    
  const { token } = req.cookies;

  // Verifica se existe um token nas cookies
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Verifica o JWT e obtem os dados do usuario
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    // Guarda o userId para ser usado nas rotas protegidas
    req.userId = payload.userId;

    next();
  } catch {
    // O token e invalido ou expirou
    return res.status(401).json({ message: 'Unauthorized' });
  }
}