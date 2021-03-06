import mongoose from "mongoose";
import voucher_codes from "voucher-code-generator";
import postCreate from "./plugins/postCreate.js";
import { createWoocommerceCoupon } from "../controllers/API/V1/api.js";

let generateCode = () => {
  let v = voucher_codes.generate({
    length: 8,
    count: 1,
    charset: "ABCDEFGHJKLMNPQRSTUVWXYZ23456789",
  });

  return v[0];
};

const couponSchema = mongoose.Schema({
  value: Number,
  creator: String,
  name: String,
  user: String,
  type: String,
  minAmount: Number,
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
  expireDate: {
    type: Date,
  },
  isExpired: { type: Boolean, default: false },
  isUsed: { type: Boolean, default: false },
  usedAt: Date,
  deletedAt: Date,
  code: { type: String, default: () => generateCode() },
  woocommerceIds: Array,
  storeAdministratorIds: Array,
});

couponSchema.plugin(postCreate);

couponSchema.addPostCreate(function (coupon, cb) {
  if (coupon.type !== "Token") {
    createWoocommerceCoupon(coupon);
  }

  return cb(null);
});

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
