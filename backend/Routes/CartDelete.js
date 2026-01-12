const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// ✅ DELETE ALL cart items + reset pizzas inCart:false
router.delete("/", async (req, res) => {
  try {
    // ✅ 1) Delete all cart items
    const cartResult = await mongoose.connection.db
      .collection("Cart")
      .deleteMany({});
console.log("delete");

    // ✅ 2) Reset all pizzas inCart to false
    const pizzaResult = await mongoose.connection.db
      .collection("pizzas")
      .updateMany({}, { $set: { inCart: false } });

    res.status(200).json({
      message: "✅ All cart items deleted & pizzas reset (inCart=false)",
      deletedCartCount: cartResult.deletedCount,
      updatedPizzaCount: pizzaResult.modifiedCount
    });
  } catch (error) {
    res.status(500).json({
      message: "❌ Error clearing cart / resetting pizzas",
      error: error.message
    });
  }
});

module.exports = router;
