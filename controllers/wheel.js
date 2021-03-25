import Wheel from "../models/wheels.js";
import ExchangeCoupon from "../models/exchangeCoupon.js";
import Coupon from "../models/coupon.js";
import { insertCoupon } from "./coupons.js";

export const getWheelPrize = async (req, res) => {
  try {
    const exchangeCoupons = await ExchangeCoupon.find({
      wheeleable: { $eq: true },
    }).sort({ order: 1 });

    //calcular el winner y crear un cupon de ese tipo
    const tokens = await Coupon.findOneAndUpdate(
      {
        user: req.userEmail,
        type: { $eq: "Token" },
        deletedAt: { $eq: null },
        isExpired: { $eq: false },
        isUsed: { $eq: false },
      },
      { isUsed: true }
    );

    //crear cupon aca.

    const notRandomNumbers = [0, 0, 0, 0, 0, 0, 0, 1, 1, 2];
    const idx = Math.floor(Math.random() * notRandomNumbers.length);
    const winner = notRandomNumbers[idx];

    console.log(exchangeCoupons[winner]);

    let date = new Date();

    await insertCoupon({
      value: exchangeCoupons[winner].value,
      user: req.userEmail,
      type: exchangeCoupons[winner].type,
      minAmount: exchangeCoupons[winner].minAmount,
      expireDate: new Date(date.setDate(date.getDate() + 7)),
    });

    res.status(200).json({
      winner,
    });
  } catch (error) {}
};
export const getWheelData = async (req, res) => {
  try {
    const exchangeCoupons = await ExchangeCoupon.find({
      wheeleable: { $eq: true },
    }).sort({ order: 1 });

    const exchangeCouponsFormatted = exchangeCoupons.map((eCoupon) => {
      return {
        option: eCoupon.name,
      };
    });

    res.status(200).json({ wheel: exchangeCouponsFormatted });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
