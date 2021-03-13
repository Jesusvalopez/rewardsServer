import express from "express";

import { getMyPoints } from "../controllers/points.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/my-points", auth, getMyPoints);

export default router;
