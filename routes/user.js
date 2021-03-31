import express from "express";
import passport from "passport";
import {
  signIn,
  signUp,
  googleSignUp,
  getUsers,
  getUsersCouponsTokens,
  generateApiKey,
  facebookSignUp,
  updateUserCommune,
} from "../controllers/user.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/signin", signIn);
router.post("/signup", signUp);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.post("/google-signup", googleSignUp);
router.post("/facebook-signup", facebookSignUp);

router.get("/get-users/:email", auth, getUsers);
router.get("/generate-api-key", auth, generateApiKey);
router.post("/get-coupons-tokens", auth, getUsersCouponsTokens);
router.post("/update-commune", auth, updateUserCommune);

export default router;
