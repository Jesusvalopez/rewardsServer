import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import couponsRoutes from "./routes/coupons.js";
import userRoutes from "./routes/user.js";
import pointsRoutes from "./routes/points.js";
import wheelRoutes from "./routes/wheel.js";
import apiV1Routes from "./routes/API/V1/api.js";
import { googleSignUp } from "./controllers/user.js";
import querystring from "querystring";

const app = express();
dotenv.config();

import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      callbackURL: "/passport/google/redirect",
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/coupons", couponsRoutes);
app.use("/points", pointsRoutes);
app.use("/user", userRoutes);
app.use("/wheel", wheelRoutes);
app.use("/v1", apiV1Routes);
app.use(passport.initialize());

app.get(
  "/passport/google/redirect",
  passport.authenticate("google"),
  async (req, res) => {
    const response = await googleSignUp(req);

    const string_response = encodeURIComponent(JSON.stringify(response));
    console.log(string_response);
    const ab = Buffer.from(string_response).toString("base64");

    //res.redirect("http://localhost:3000/auth/google/redirect?token=" + ab);
    res.redirect("https://rewards.sticks.cl/auth/google/redirect?token=" + ab);

    // res.send("you reached the callback url");
  }
);

app.get("/", () => {
  res.send("Hola");
});

//connect mongodb
const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () => console.log("server running on port: " + PORT))
  )
  .catch((error) => console.log(error.message));

mongoose.set("useFindAndModify", false);
