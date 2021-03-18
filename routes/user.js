import express from "express";

import {
  signIn,
  signUp,
  googleSignUp,
  getUsers,
  getUsersCouponsTokens,
  generateApiKey,
} from "../controllers/user.js";
import auth from "../middleware/auth.js";
const router = express.Router();

router.post("/signin", signIn);
router.post("/signup", signUp);
router.post("/google-signup", googleSignUp);
router.get("/get-users/:email", auth, getUsers);
router.get("/generate-api-key", auth, generateApiKey);
router.post("/get-coupons-tokens", auth, getUsersCouponsTokens);

export default router;
