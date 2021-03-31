import express from "express";

import {
  getUsers,
  getUsersCouponsTokens,
  generateApiKey,
  updateUserCommune,
} from "../controllers/user.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/get-users/:email", auth, getUsers);
router.get("/generate-api-key", auth, generateApiKey);
router.post("/get-coupons-tokens", auth, getUsersCouponsTokens);
router.post("/update-commune", auth, updateUserCommune);

export default router;
