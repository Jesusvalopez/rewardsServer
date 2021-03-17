import mongoose from "mongoose";

const couponSchema = mongoose.Schema({
  value: Number,
  creator: String,
  user: String,
  type: String,
  minAmount: Number,
  createdAt: {
    type: Date,
    default: new Date(),
  },
  expireDate: {
    type: Date,
  },
  isExpired: { type: Boolean, default: false },
  isUsed: { type: Boolean, default: false },
  usedAt: Date,
  deletedAt: Date,
});

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
