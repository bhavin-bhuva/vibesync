import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { env } from './env';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        const name = profile.displayName;
        const photo = profile.photos?.[0].value;

        if (!email) {
          return done(new Error('No email found directly from Google'));
        }

        const user = await authService.handleSocialLogin(name, email, photo);
        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

export default passport;
