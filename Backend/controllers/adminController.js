import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Register admin
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const adminExists = await Admin.findOne({ email });
    if (adminExists) return res.status(400).json({ message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({ name, email, password: hashedPassword });
    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login admin
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (admin && (await bcrypt.compare(password, admin.password))) {
      res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// List all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// List all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("buyer", "name email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify seller
export const verifyUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isVerified = true;
    await user.save();
    res.json({ message: "User verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.remove();
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};