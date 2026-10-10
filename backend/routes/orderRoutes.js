const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,

} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create order from cart
router.post("/", protect, createOrder);

// Get all orders of logged-in user
router.get("/", protect, getMyOrders);

// Get one order
router.get("/", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.patch("/:id/cancel", protect, cancelOrder);
module.exports = router;