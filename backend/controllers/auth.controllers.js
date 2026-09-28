import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  sameSite: isProduction ? "none" : "lax",
  secure: isProduction,
};

export const signUp = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({
        message: "Email already exists!",
      });
    }

    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
      return res.status(400).json({
        message: "Username already exists!",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must have at least 8 letters or characters",
      });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPass,
    });

    const token = await genToken(user._id);

    res.cookie("token", token, cookieOptions);

    return res.status(201).json(user);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email or username is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email/username or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email/username or password",
      });
    }

    const token = await genToken(user._id);

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    });

    return res.status(200).json({
      message: "Logout successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
