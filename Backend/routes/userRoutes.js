import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllSellers,
  checkUserExists,
  verifyUser,
  deleteUser,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

/*
========================
Public Routes
========================
*/

// Register user (no files required)
router.post("/register", registerUser);

// Debug: check if email exists
router.get("/exists", checkUserExists);

// Login
router.post("/login", loginUser);

/*
========================
Protected Routes
========================
*/

// Get profile
router.get("/profile/:id", protect, getUserProfile);

// Update profile (profile image optional)
router.put(
  "/profile/:id",
  protect,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "cardFront", maxCount: 1 },
    { name: "cardBack", maxCount: 1 },
  ]),
  updateUserProfile
);

/*
========================
Admin Routes
========================
*/

// Get all sellers
router.get("/all-sellers", protect, admin, getAllSellers);

// Verify user
router.put("/verify/:id", protect, admin, verifyUser);

// Delete user
router.delete("/delete/:id", protect, admin, deleteUser);

export default router;

