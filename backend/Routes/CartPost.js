const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// ✅ POST = insert into cart collection
router.post("/", async (req, res) => {
  try {
    console.log("✅ POST /api/cart body:", req.body);

    const result = await mongoose.connection.db
      .collection("Cart")
      .insertOne(req.body);

    res.status(201).json({
      message: "✅ Added to cart",
      insertedId: result.insertedId
    });
  } catch (error) {
    console.error("❌ Cart POST error:", error);
    res.status(500).json({
      message: "❌ Error saving cart",
      error: error.message
    });
  }
});

module.exports = router;
