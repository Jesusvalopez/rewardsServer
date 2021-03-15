import express from "express";

import {
  signIn,
  signUp,
  googleSignUp,
  getUsers,
  getUsersCouponsTokens,
} from "../controllers/user.js";
import auth from "../middleware/auth.js";
const router = express.Router();

router.post("/signin", signIn);
router.post("/signup", signUp);
router.post("/google-signup", googleSignUp);
router.get("/get-users/:email", auth, getUsers);
router.post("/get-coupons-tokens", auth, getUsersCouponsTokens);

export default router;
