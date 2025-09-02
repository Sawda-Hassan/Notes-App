import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("_id email");
    if (!user) return res.status(401).json({ message: "User not found" });
    req.user = { id: user._id, email: user.email };
    next();
  } catch {
    return res.status(401).json({ message: "Token invalid/expired" });
  }
};
