import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { uploadImage } from "../services/imagekitService.js";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Register user
export const registerUser = async (req, res) => {
  try {
    // Accept simple JSON registration or multipart/form-data if images provided.
  const { name, email, password, university, department, role } = req.body;
  console.log("[registerUser] incoming body:", { body: req.body, files: req.files ? Object.keys(req.files) : undefined });
  const normalizedEmail = (email || "").toLowerCase();

  // Use normalized (lowercased) email when searching/creating to avoid duplicates
  const userExists = await User.findOne({ email: normalizedEmail });
  console.log("[registerUser] normalizedEmail:", normalizedEmail, "userExists:", !!userExists);
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

    // Optional files: handle if present, otherwise skip
    const profileImageFile = req.files?.profileImage?.[0];
    const cardFrontFile = req.files?.cardFront?.[0];
    const cardBackFile = req.files?.cardBack?.[0];

    let profileImageUrl;
    let studentCardUrl;
  let cardBackUrl;

    if (profileImageFile) {
      profileImageUrl = await uploadImage(profileImageFile);
    }

    if (cardFrontFile) {
      // prefer front card as studentCardImage
      studentCardUrl = await uploadImage(cardFrontFile);
    }

    if (cardBackFile) {
      cardBackUrl = await uploadImage(cardBackFile);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      university: university || undefined,
      department: department || undefined,
      // default to 'buyer' if not provided
      role: role || "buyer",
      profileImage: profileImageUrl,
      studentCardImage: studentCardUrl,
      cardBackImage: cardBackUrl,
      isVerified: false,
    });

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Register Error:", error);
    // If duplicate key error occurs at save time, return a more helpful 400 message
    if (error.code === 11000) {
      const dupField = Object.keys(error.keyValue || {}).join(",") || "email";
      return res.status(400).json({ message: `${dupField} already exists` });
    }
    res.status(500).json({ message: "Server error during registration" });
  }
};

// Login
export const loginUser = async (req, res) => {
  try {
  const { email, password } = req.body;
  const normalizedEmail = (email || "").toLowerCase();

  const user = await User.findOne({ email: normalizedEmail });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update basic fields
    user.name = req.body.name || user.name;
    user.university = req.body.university || user.university;
    user.department = req.body.department || user.department;

    // Handle optional multipart uploads (profile image, card front/back)
    const profileImageFile = req.files?.profileImage?.[0];
    const cardFrontFile = req.files?.cardFront?.[0];
    const cardBackFile = req.files?.cardBack?.[0];

    if (profileImageFile) {
      const profileImageUrl = await uploadImage(profileImageFile);
      user.profileImage = profileImageUrl;
    }

    if (cardFrontFile) {
      const cardFrontUrl = await uploadImage(cardFrontFile);
      user.studentCardImage = cardFrontUrl;
      // If user provides student card, mark them as seller (informational)
      user.role = "seller";
    }

    if (cardBackFile) {
      // upload and store the back of the student card as well
      const cardBackUrl = await uploadImage(cardBackFile);
      user.cardBackImage = cardBackUrl;
    }

    await user.save();

    // Return sanitized user (without password)
    const safeUser = await User.findById(user._id).select("-password");
    res.json(safeUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all sellers
export const getAllSellers = async (req, res) => {
  try {
    const sellers = await User.find({ role: "seller" }).select("-password");

    res.json(sellers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin verify
export const verifyUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

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

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();

    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Debug: check if an email already exists (case-insensitive)
export const checkUserExists = async (req, res) => {
  try {
    const email = (req.query.email || "").toLowerCase();
    if (!email) return res.status(400).json({ message: "email query param required" });
    const user = await User.findOne({ email }).select("-password");
    res.json({ exists: !!user, user: user || null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};