import { Router, RequestHandler } from 'express';
import passport from 'passport';
import { getUser, googleCallback, logout } from './auth.controller';

const router = Router();

//envio o usuário para o Google para autenticação:
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }) as RequestHandler);

//callback do Google após a autenticação, redirecionando para o frontend com o token JWT
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login', session: false }) as RequestHandler, googleCallback as RequestHandler);

router.get ("/me", getUser as RequestHandler);
router.post("/logout", logout as RequestHandler);

export default router;