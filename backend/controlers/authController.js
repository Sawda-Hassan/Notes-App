import jwt from "jsonwebtoken";
import User from "../models/User.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || "7d" });

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email already in use" });

  const user = await User.create({ name, email, password });
  const token = signToken(user._id);
  res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken(user._id);
  res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
};
