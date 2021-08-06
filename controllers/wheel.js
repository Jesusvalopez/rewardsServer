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
    //si no tiene token no dejarlo girar
    const token = await Coupon.findOne({
      user: req.userEmail,
      type: { $eq: "Token" },
      deletedAt: { $eq: null },
      isExpired: { $eq: false },
      isUsed: { $eq: false },
    });

    console.log(token)

    if (!token) {
      res.status(200).json({
        winner: null,
        coupon: null,
        message: "No tienes tokens para girar la ruleta",
      });
    }

    console.log("hay token")

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

    const notRandomNumbers = [];

    //position = order - 1

    const generate = [
      { position: 0, quantity: 5 }, // cupon 2000
      { position: 1, quantity: 40 }, // minis de queso
      { position: 2, quantity: 30 }, // minis de chocolate
      { position: 3, quantity: 5 }, // milksha
      { position: 4, quantity: 15 }, // papas fritas
      { position: 5, quantity: 5 }, // Classic B
    ];

    generate.map((obj) => {
      for (let i = 0; i < obj.quantity; i++) {
        notRandomNumbers.push(obj.position);
      }
    });

    const idx = Math.floor(Math.random() * notRandomNumbers.length);
    const winner = notRandomNumbers[idx];

    let date = new Date();

    const couponData = {
      value: exchangeCoupons[winner].value,
      user: req.userEmail,
      type: exchangeCoupons[winner].type,
      minAmount: exchangeCoupons[winner].minAmount,
      expireDate: new Date(date.setDate(date.getDate() + 7)),
    };

    const woocommerceIds = exchangeCoupons[winner].woocommerceIds;
    const storeAdministratorIds = exchangeCoupons[winner].storeAdministratorIds;
    const couponName = exchangeCoupons[winner].name;
    let newCouponData =
      exchangeCoupons[winner].type === "Product"
        ? {
            ...couponData,
            woocommerceIds,
            storeAdministratorIds,
            name: couponName,
          }
        : couponData;

    const coupon = await insertCoupon(newCouponData);

    res.status(200).json({
      winner,
      coupon,
    });
  } catch (error) {
    console.log("Error wheelPrize: ");
    console.log(error);
  }
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
