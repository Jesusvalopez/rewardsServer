import express from "express";

import { getWheelData, getWheelPrize } from "../controllers/wheel.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getWheelData);
router.get("/prize", auth, getWheelPrize);

export default router;
