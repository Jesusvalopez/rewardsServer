import express from "express";

import {
  getUsersByEmail,
  getUsersCoupons,
} from "../../../controllers/API/V1/api.js";
import apiKeyAuth from "../../../middleware/apiKeyAuth.js";
import { createPoints } from "../../../controllers/points.js";
const router = express.Router();

router.get("/get-users/:email", apiKeyAuth, getUsersByEmail);
router.get("/get-users-coupons/:id", apiKeyAuth, getUsersCoupons);
router.post("/create-points-by-sale", apiKeyAuth, createPoints);

export default router;
