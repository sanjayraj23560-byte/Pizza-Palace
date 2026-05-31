import UserModel from "../models/User.js";
import bcrypt from "bcryptjs";
const ADMIN_USERNAME = "pizzapalace_admin"
const ADMIN_PASSWORD = "admin@123"

export const AdminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    res.status(200).json({
      _id: "admin",
      username: ADMIN_USERNAME,
      isAdmin: true
    });

  } catch (error) {
    res.status(500).json({ message: "Admin login error" });
  }
};

export const Signup = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "Username and password required" });

    const existing = await UserModel.findOne({ username });
    if (existing)
      return res.status(400).json({ message: "Username already taken" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "Account created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Signup server error", error: err.message });
  }
};

export const Login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Wrong password" });

    res.status(200).json({
      _id: user._id,
      username: user.username,
      isAdmin: user.isAdmin
    });
  } catch (err) {
    res.status(500).json({ message: "Login server error", error: err.message });
  }
};