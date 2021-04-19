import express from "express";

import {
  getUsers,
  getUsersCouponsTokens,
  generateApiKey,
  updateUserCommune,
  signIn,
  signUp,
} from "../controllers/user.js";
import auth from "../middleware/auth.js";

import User from "../models/user.js";

const router = express.Router();

router.get("/get-users-count/", async (req, res) => {
  const usersCount = await User.find().countDocuments();

  res.send({ usersCount });
});
router.post("/signin", signIn);
router.post("/signup", signUp);
router.get("/get-users/:email", auth, getUsers);
router.get("/generate-api-key", auth, generateApiKey);
router.post("/get-coupons-tokens", auth, getUsersCouponsTokens);
router.post("/update-commune", auth, updateUserCommune);

export default router;
