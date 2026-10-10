const express = require("express");

const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
} = require("../controllers/cartController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get user's cart
router.get("/", protect, getCart);

// Add product to cart
router.post("/", protect, addToCart);

// Update product quantity
router.put("/", protect, updateCartItem);

// Remove product from cart
router.delete("/:productId", protect, removeFromCart);

module.exports = router;