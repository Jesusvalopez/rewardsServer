import mongoose from "mongoose";
import Points from "../models/points.js";
import User from "../models/user.js";
import Coupon from "../models/coupon.js";

export const getMyPoints = async (req, res) => {
  const perPage = 15,
    page = Math.max(0, req.query.page);

  console.log(perPage);
  console.log(req.query.page);

  try {
    const points = await Points.find({ user_id: req.userId })
      .limit(perPage)
      .skip(perPage * page)
      .sort({
        createdAt: -1,
      });

    const user = await User.findById({ _id: req.userId });

    res.status(200).json({ points: points, pointsTotal: user.points });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getPointsByAmount = (sale_total_amount) => {
  const divided = sale_total_amount / 100;

  // Smaller multiple
  const smaller = parseInt(divided / 10) * 10;

  // Larger multiple
  const larger = smaller + 10;

  // Return of closest of two
  const result = divided - smaller < larger - divided ? smaller : larger;

  return result;
};

export const createPoints = async (req, res) => {
  const {
    user_id,
    sale_total_amount,
    description,
    sale_id,
    coupons_ids,
  } = req.body;

  const value = getPointsByAmount(sale_total_amount);

  try {
    await createPointsMethod(user_id, value, description, sale_id);
    await updateUserPoints(user_id, value);
    if (coupons_ids) {
      await useCoupons(coupons_ids);
    }
    res.status(201).json({ message: "Puntos creados con éxito" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const useCoupons = async (coupons_ids) => {
  try {
    await Promise.all(
      coupons_ids.map(async (coupon) => {
        const couponFind = await Coupon.findByIdAndUpdate(
          {
            _id: coupon.value,
          },
          {
            isUsed: true,
            usedAt: new Date(),
          },
          { new: true }
        );
      })
    );
  } catch (error) {}
};

export const updateUserPoints = async (
  user_id,
  value,
  operation = "INCREMENT"
) => {
  try {
    let user = await User.findById({ _id: user_id });

    let points = 0;
    if (operation == "INCREMENT") {
      points = user.points + value;
    } else {
      points = user.points - value;
    }

    const updatedUser = await User.findByIdAndUpdate(
      { _id: user_id },
      { points: points },
      { new: true }
    );

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
};

export const createPointsMethod = async (
  user_id,
  value,
  description,
  sale_id = null
) => {
  let date = new Date();

  let pointsModel = {
    user_id,
    value,
    description,
    expireDate: new Date(date.setMonth(date.getMonth() + 1)),
    createdAt: new Date(),
  };

  let newModel = sale_id ? { ...pointsModel, sale_id } : pointsModel;

  const newPoints = new Points(newModel);

  try {
    await newPoints.save();
    return newPoints;
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
