import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsBySeller,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";
import { seller, authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.get("/seller/:sellerId", getProductsBySeller);

// Protected (Seller)
router.post("/create", protect, seller, createProduct);
router.put("/update/:id", protect, authorizeRoles("seller", "admin"), updateProduct);
router.delete("/delete/:id", protect, authorizeRoles("seller", "admin"), deleteProduct);

export default router;