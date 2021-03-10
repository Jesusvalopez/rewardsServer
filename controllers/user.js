import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.js";

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
      { expiresIn: "1h" }
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
    });

    const token = jwt.sign(
      { email: result.email, id: result._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ result: result, token });
  } catch (error) {
    res.status(500).json({ message: "Algo salió mal" });
  }
};

export const googleSignUp = async (req, res) => {
  const { email, name } = req.body.profile;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const token = jwt.sign(
        { email: existingUser.email, id: existingUser._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      res.status(200).json({ result: existingUser, token });
    } else {
      const hashedPassword = await bcrypt.hash("xaasjkaksjdasd", 12);
      const result = await User.create({
        email,
        password: hashedPassword,
        name: name,
        provider: "google",
      });

      const token = jwt.sign(
        { email: result.email, id: result._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      res.status(200).json({ result: result, token });
    }
  } catch (error) {
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};
