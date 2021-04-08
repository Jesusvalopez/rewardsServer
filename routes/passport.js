import express from "express";
import passport from "passport";

import { Facebook, Google } from "../config/passportSetup.js";
import { facebookSignUp, googleSignUp } from "../controllers/user.js";

const router = express.Router();

router.get("/auth/facebook", passport.authenticate("facebook"));
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook"),
  async (req, res) => {
    const response = await facebookSignUp(req);

    const stringResponse = encodeURIComponent(JSON.stringify(response));

    const base64Response = Buffer.from(stringResponse).toString("base64");

    //res.redirect("http://localhost:3000/auth/redirect?token=" + base64Response);
    res.redirect(
      "https://premios.sticks.cl/auth/redirect?token=" + base64Response
    );
  }
);

router.get(
  "/google/callback",
  passport.authenticate("google"),
  async (req, res) => {
    const response = await googleSignUp(req);

    const stringResponse = encodeURIComponent(JSON.stringify(response));

    const base64Response = Buffer.from(stringResponse).toString("base64");

    //   res.redirect("http://localhost:3000/auth/redirect?token=" + base64Response);
    res.redirect(
      "https://premios.sticks.cl/auth/redirect?token=" + base64Response
    );
  }
);

export default router;
