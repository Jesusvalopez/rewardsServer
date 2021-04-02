import mongoose from "mongoose";
import Coupon from "../models/coupon.js";
import ExchangeCoupon from "../models/exchangeCoupon.js";
import User from "../models/user.js";
import { updateUserPoints, createPointsMethod } from "../controllers/points.js";

export const exchangeCoupon = async (req, res) => {
  try {
    const exchangeCoupon = await ExchangeCoupon.findById({ _id: req.body.id });
    const user = await User.findById({ _id: req.userId });

    //si el cupon es token por ahora no hacer nada
    //actualizar historial
    //crear cupon

    if (!user.points > exchangeCoupon.pointsToExchange)
      res.status(404).json({
        message: "No tienes suficientes puntos para canjear el cupón",
      });

    const updatedUser = await updateUserPoints(
      user._id,
      exchangeCoupon.pointsToExchange,
      "DECREMENT"
    );

    //actualizar historial
    const pointsHistory = await createPointsMethod(
      user._id,
      -Math.abs(exchangeCoupon.pointsToExchange),
      "Canje " + exchangeCoupon.name
    );

    let date = new Date();

    let couponData = {
      value: exchangeCoupon.value,
      user: user.email,
      type: exchangeCoupon.type,
      minAmount: exchangeCoupon.minAmount,
      expireDate: new Date(date.setMonth(date.getMonth() + 1)),
    };

    //let newModel = sale_id ? { ...pointsModel, sale_id } : pointsModel;
    const woocommerceIds = exchangeCoupon.woocommerceIds;
    const storeAdministratorIds = exchangeCoupon.storeAdministratorIds;
    const couponName = exchangeCoupon.name;
    let newCouponDatas =
      exchangeCoupon.type === "Product"
        ? {
            ...couponData,
            woocommerceIds,
            storeAdministratorIds,
            name: couponName,
          }
        : couponData;

    console.log(exchangeCoupon);
    console.log("WENOOO:");
    console.log(newCouponDatas);

    //crear cupon
    await insertCoupon(newCouponData);

    //CREAR CUPON EN WOOCOMMERCE

    res
      .status(200)
      .json({ points: updatedUser.points, lastPoint: pointsHistory });
  } catch (error) {}
};
export const getExchangeCoupons = async (req, res) => {
  try {
    const exchangeCoupons = await ExchangeCoupon.find({
      type: { $ne: "Token" },
    }).sort({ order: 1 });
    const collections = Object.keys(mongoose.connection.collections);

    res.status(200).json(exchangeCoupons);
    setTimeout(function () {}, 1500);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getMyCouponsCount = async (req, res) => {
  try {
    // console.log(req.userEmail);
    const coupons = await Coupon.find({
      user: req.userEmail,
      type: { $ne: "Token" },
      deletedAt: { $eq: null },
      isExpired: { $eq: false },
      isUsed: { $eq: false },
    }).countDocuments();

    const tokens = await Coupon.find({
      user: req.userEmail,
      type: { $eq: "Token" },
      deletedAt: { $eq: null },
      isExpired: { $eq: false },
      isUsed: { $eq: false },
    }).countDocuments();

    res.status(200).json({ coupons, tokens });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getMyCoupons = async (req, res) => {
  const state = req.params.state;

  let findObject = {
    user: req.userEmail,
    type: { $ne: "Token" },
    deletedAt: { $eq: null },
    isExpired: { $eq: false },
    isUsed: { $eq: false },
  };

  try {
    switch (state) {
      case "active": {
        findObject = {
          ...findObject,
          isExpired: { $eq: false },
          isUsed: { $eq: false },
        };
        break;
      }
      case "used": {
        findObject = {
          ...findObject,
          isUsed: { $eq: true },
        };
        break;
      }
      case "expired": {
        findObject = {
          ...findObject,
          isExpired: { $eq: true },
        };
        break;
      }
    }

    const coupons = await Coupon.find(findObject);

    console.log(coupons);

    res.status(200).json(coupons);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();

    res.status(200).json(coupons);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createCoupon = async (req, res) => {
  const coupon = req.body;

  try {
    newCoupon = await insertCoupon(coupon);

    res.status(201).json(newCoupon);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const insertCoupon = async (coupon) => {
  const newCoupon = new Coupon(coupon);

  try {
    await newCoupon.save();

    return newCoupon;
  } catch (error) {
    console.log(error);
  }
};

export const updateCoupon = async (req, res) => {
  const { id: _id } = req.params;
  const coupon = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No hay cupón con ese Id");

  const updatedCoupon = await Coupon.findByIdAndUpdate(
    _id,
    { ...coupon, _id },
    { new: true }
  );

  res.json(updatedCoupon);
};

export const deleteCoupon = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No hay cupón con ese Id");

  await Coupon.findByIdAndRemove(_id);

  res.json({ message: "Cupón eliminado" });
};
