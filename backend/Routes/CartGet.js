const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// ✅ GET route to fetch cart items
router.get("/", async (req, res) => {
  try {
    const cart = await mongoose.connection.db.collection("Cart").find({}).toArray();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({
      message: "❌ Error fetching cart",
      error: error.message
    });
  }
});

module.exports = router;
