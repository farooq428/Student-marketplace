import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllSellers,
  verifyUser,
  deleteUser,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/profile/:id", protect, getUserProfile);
router.put("/profile/:id", protect, updateUserProfile);

// Admin routes
router.get("/all-sellers", protect, admin, getAllSellers);
router.put("/verify/:id", protect, admin, verifyUser);
router.delete("/delete/:id", protect, admin, deleteUser);

export default router;