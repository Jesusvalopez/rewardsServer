import User from "../../../models/user.js";
import Coupon from "../../../models/coupon.js";

export const getUsersCoupons = async (req, res) => {
  try {
    console.log(req.params.id);
    const user = await User.findOne({
      _id: req.params.id,
    });

    const coupons = await Coupon.find({
      user: user.email,
      deletedAt: { $eq: null },
      isExpired: { $eq: false },
      isUsed: { $eq: false },
    });

    return res.status(200).json({ coupons });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
export const getUsersByEmail = async (req, res) => {
  try {
    const users = await User.find({
      email: { $regex: req.params.email, $options: "i" },
    }).select("email");

    return res.status(200).json({ users });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
