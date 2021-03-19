import express from "express";

import {
  getUsersByEmail,
  getUsersCoupons,
} from "../../../controllers/API/V1/api.js";
import apiKeyAuth from "../../../middleware/apiKeyAuth.js";
const router = express.Router();

router.get("/get-users/:email", apiKeyAuth, getUsersByEmail);
router.get("/get-users-coupons/:id", apiKeyAuth, getUsersCoupons);

export default router;
