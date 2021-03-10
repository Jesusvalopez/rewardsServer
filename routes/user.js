import express from "express";

import { signIn, signUp, googleSignUp } from "../controllers/user.js";

const router = express.Router();

router.post("/signin", signIn);
router.post("/signup", signUp);
router.post("/google-signup", googleSignUp);

export default router;
