import express from "express";
import {
  createOrder,
  getOrdersByBuyer,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin, buyer } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Buyer routes
router.post("/create", protect, buyer, createOrder);
router.get("/user/:buyerId", protect, buyer, getOrdersByBuyer);

// Admin routes
router.get("/all", protect, admin, getAllOrders);
router.put("/update/:id", protect, admin, updateOrderStatus);

// Protected for any authenticated user
router.get("/:id", protect, getOrderById);

export default router;