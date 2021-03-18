import express from "express";

import { getUsersByEmail } from "../../../controllers/API/V1/api.js";
import apiKeyAuth from "../../../middleware/apiKeyAuth.js";
const router = express.Router();

router.get("/get-users/:email", apiKeyAuth, getUsersByEmail);

export default router;
