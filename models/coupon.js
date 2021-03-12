import mongoose from "mongoose";

const couponSchema = mongoose.Schema({
  value: Number,
  creator: String,
  user: String,
  status: String,
  type: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
  expireDate: {
    type: Date,
  },
});

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
