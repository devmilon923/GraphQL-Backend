import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SEC as string,
      callbackURL: process.env.GOOGLE_CB as string,
    },
    async (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    },
  ),
);
