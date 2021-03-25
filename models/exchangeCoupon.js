import mongoose from "mongoose";

const exchangeCouponSchema = mongoose.Schema({
  name: String,
  value: Number,
  minAmount: Number,
  type: String,
  pointsToExchange: Number,
  wheeleable: Boolean,
  order: Number,
});

const ExchangeCoupon = mongoose.model("ExchangeCoupon", exchangeCouponSchema);

export default ExchangeCoupon;
