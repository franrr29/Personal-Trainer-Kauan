//configuração do passport para autenticação com o Google
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { findOrCreateUser } from '../modules/auth/auth.service';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: 'http://localhost:4000/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value || '';
    const name = profile.displayName;
    const avatar = profile.photos?.[0]?.value || '';
    const user = await findOrCreateUser(email, name, avatar);
    done(null, user);
  } catch (error) {
    done(error as Error);
  }
}));