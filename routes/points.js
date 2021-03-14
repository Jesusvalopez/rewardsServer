import express from "express";

import { getMyPoints, createPoints } from "../controllers/points.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/my-points", auth, getMyPoints);
router.post("/create-points-by-sale", auth, createPoints);

export default router;
