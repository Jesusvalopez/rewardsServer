import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
export const passportSetup = passport.use(
  new GoogleStrategy(
    {
      callbackURL: "/passport/google/redirect",
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    () => {
      //passport callback funct
    }
  )
);
