import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createPointsMethod, updateUserPoints } from "./points.js";
import { insertCoupon } from "./coupons.js";

import User from "../models/user.js";
import Coupon from "../models/coupon.js";
import ApiKey from "../models/apiKey.js";
import crypto from "crypto";

export const updateUserCommune = async (req, res) => {
  try {
    const commune = req.body.commune;

    await User.findByIdAndUpdate({ _id: req.userId }, { commune: commune });
    res.status(200).json({ commune: commune, message: "Comuna actualizada" });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

export const generateApiKey = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    const API_KEY = crypto
      .createHmac("sha1", user._id.toString())
      .update(Date.now().toString())
      .digest("hex");

    const API_SECRET = crypto
      .createHmac("sha1", API_KEY)
      .update(Date.now().toString())
      .digest("hex");

    const DATABASE_KEY_SECRET = crypto
      .createHmac("sha1", API_KEY)
      .update(API_SECRET)
      .digest("hex");

    await ApiKey.create({
      userId: req.userId,
      apiKey: API_KEY,
      apiSecret: DATABASE_KEY_SECRET,
    });

    res.status(200).json({ API_KEY, API_SECRET });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

export const getUsersCouponsTokens = async (req, res) => {
  try {
    console.log(req.body);
    const coupons = await Coupon.find({
      user: req.body.email,
      deletedAt: { $eq: null },
      isExpired: { $eq: false },
      isUsed: { $eq: false },
    });

    res.status(200).json(coupons);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
export const getUsers = async (req, res) => {
  try {
    console.log(req.params.email);

    const users = await User.find({
      email: { $regex: req.params.email, $options: "i" },
    }).select("email");

    return res.status(200).json({ users });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
export const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: "El usuario no existe" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Credenciales invalidas" });
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "Algo salió mal" });
  }
};

export const signUp = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Las contraseñas no coinciden" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      email,
      password: hashedPassword,
      name: firstName + " " + lastName,
      provider: "local",
      points: 0,
    });

    const token = jwt.sign(
      { email: result.email, id: result._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h",
      }
    );

    await createPointsMethod(result._id, 20, "Registro");
    await updateUserPoints(result._id, 20);
    await addRegisterCoupons(email);

    res.status(200).json({ result: result, token });
  } catch (error) {
    res.status(500).json({ message: "Algo salió mal" });
  }
};

const addRegisterCoupons = async (email) => {
  let date = new Date();

  await insertCoupon({
    value: 0,
    user: email,
    type: "Token",
    minAmount: 0,
    expireDate: new Date(date.setDate(date.getDate() + 7)),
  });
};

export const facebookSignUp = async (req, res) => {
  const { first_name, email } = req.user._json;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const token = jwt.sign(
        { email: existingUser.email, id: existingUser._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "8h",
        }
      );

      return { result: existingUser, token };
      // res.status(200).json({ result: existingUser, token });
    } else {
      const pass = crypto
        .createHmac("sha1", email)
        .update(Date.now().toString())
        .digest("hex");
      const hashedPassword = await bcrypt.hash(pass, 12);
      const result = await User.create({
        email,
        password: hashedPassword,
        name: first_name,
        provider: "facebook",
        points: 0,
      });

      const token = jwt.sign(
        { email: result.email, id: result._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "8h",
        }
      );

      await createPointsMethod(result._id, 20, "Registro");
      await updateUserPoints(result._id, 20);
      await addRegisterCoupons(email);

      return { result: result, token };
      res.status(200).json({ result: result, token });
    }
  } catch (error) {
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};
export const googleSignUp = async (req) => {
  const { name, email } = req.user._json;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const token = jwt.sign(
        { email: existingUser.email, id: existingUser._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "8h",
        }
      );
      return { result: existingUser, token };
      res.status(200).json({ result: existingUser, token });
    } else {
      const pass = crypto
        .createHmac("sha1", email)
        .update(Date.now().toString())
        .digest("hex");
      const hashedPassword = await bcrypt.hash(pass, 12);
      const result = await User.create({
        email,
        password: hashedPassword,
        name: name,
        provider: "google",

        points: 0,
      });

      const token = jwt.sign(
        { email: result.email, id: result._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "8h",
        }
      );

      await createPointsMethod(result._id, 20, "Registro");
      await updateUserPoints(result._id, 20);
      await addRegisterCoupons(email);
      return { result: result, token };
      res.status(200).json({ result: result, token });
    }
  } catch (error) {
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};
