import express from "express";
import {
  createReview,
  getReviewsBySeller,
  getReviewsByBuyer,
  deleteReview,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";
import { buyer, admin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Buyer routes
router.post("/create", protect, buyer, createReview);
router.get("/buyer/:buyerId", protect, buyer, getReviewsByBuyer);

// Public route
router.get("/seller/:sellerId", getReviewsBySeller);

// Admin route to delete any review
router.delete("/delete/:id", protect, admin, deleteReview);

export default router;
