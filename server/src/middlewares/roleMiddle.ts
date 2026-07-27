import { Request, Response, NextFunction } from 'express';


//verifica se o user tem o role necessario para acessar a rota
export function roleMiddleware(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {

    if (!req.userRole || !roles.includes(req.userRole)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
}