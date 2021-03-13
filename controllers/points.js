import mongoose from "mongoose";
import Points from "../models/points.js";

export const getMyPoints = async (req, res) => {
  try {
    const points = await Points.find({ user_id: req.userId }).sort({
      createdAt: -1,
    });

    res.status(200).json(points);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
