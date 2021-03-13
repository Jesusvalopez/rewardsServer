import express from "express";

import {
  getCoupons,
  getMyCoupons,
  getMyCouponsCount,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "../controllers/coupons.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getCoupons);
router.get("/my-coupons", auth, getMyCoupons);
router.get("/my-coupons-count", auth, getMyCouponsCount);
router.post("/", auth, createCoupon);
router.patch("/:id", auth, updateCoupon);
router.delete("/:id", auth, deleteCoupon);

export default router;
