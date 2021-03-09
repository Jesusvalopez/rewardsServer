import mongoose from "mongoose";
import Coupon from "../models/coupon.js";

export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();

    console.log("trayendo data");

    res.status(200).json(coupons);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createCoupon = async (req, res) => {
  const coupon = req.body;

  const newCoupon = new Coupon(coupon);

  try {
    await newCoupon.save();

    res.status(201).json(newCoupon);
  } catch (error) {
    res.status(409).json({ message: error.message });
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
