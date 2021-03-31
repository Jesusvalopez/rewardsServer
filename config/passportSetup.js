import passport from "passport";
import facebookStrategy from "passport-facebook";
import GoogleStrategy from "passport-google-oauth20";
import dotenv from "dotenv";
const FacebookStrategy = facebookStrategy.Strategy;

dotenv.config();

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

export const Google = passport.use(
  new GoogleStrategy(
    {
      callbackURL: "/passport/google/callback",
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      proxy: true,
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);

export const Facebook = passport.use(
  new FacebookStrategy(
    {
      callbackURL: "/passport/facebook/callback",
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      proxy: true,
      profileFields: ["email", "name"],
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);
