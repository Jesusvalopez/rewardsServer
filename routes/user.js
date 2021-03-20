import express from "express";

import {
  signIn,
  signUp,
  googleSignUp,
  getUsers,
  getUsersCouponsTokens,
  generateApiKey,
  facebookSignUp,
} from "../controllers/user.js";
import auth from "../middleware/auth.js";
const router = express.Router();

router.post("/signin", signIn);
router.post("/signup", signUp);
router.post("/google-signup", googleSignUp);
router.post("/facebook-signup", facebookSignUp);
router.get("/get-users/:email", auth, getUsers);
router.get("/generate-api-key", auth, generateApiKey);
router.post("/get-coupons-tokens", auth, getUsersCouponsTokens);

export default router;
