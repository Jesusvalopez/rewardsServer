import User from "../../../models/user.js";

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
