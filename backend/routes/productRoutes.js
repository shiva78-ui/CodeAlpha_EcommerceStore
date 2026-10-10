const express = require("express");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get all products
router.get("/", getProducts);

// Get one product
router.get("/:id", getProductById);

// Create product
router.post("/", protect, createProduct);

// Update product
router.put("/:id", protect, updateProduct);

// Delete product
router.delete("/:id", protect, deleteProduct);

module.exports = router;