import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getAllUsers,
  getAllOrders,
  verifyUser,
  deleteUser,
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// Admin protected
router.get("/users", protect, admin, getAllUsers);
router.get("/orders", protect, admin, getAllOrders);
router.put("/verify-user/:id", protect, admin, verifyUser);
router.delete("/delete-user/:id", protect, admin, deleteUser);

export default router;