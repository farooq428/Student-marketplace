import express from "express";
import {
  addToCart,
  updateCart,
  getCartByUser,
  clearCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";
import { buyer } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Buyer routes
router.post("/add", protect, buyer, addToCart);
router.put("/update/:userId", protect, buyer, updateCart);
router.get("/user/:userId", protect, buyer, getCartByUser);
router.delete("/clear/:userId", protect, buyer, clearCart);

export default router;