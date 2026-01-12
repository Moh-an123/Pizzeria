const express = require("express");
const router = express.Router();
const Cart = require("../Schema/Cart");
const Pizza = require("../Schema/Pizza"); // ✅ import pizza schema

// ✅ DELETE cart item by pizza id & set pizza inCart:false
router.delete("/:id", async (req, res) => {
  try {
    const pizzaId = req.params.id;

    // ✅ 1) delete from cart using pizza id
    const deletedItem = await Cart.findOneAndDelete({ id: pizzaId });

    if (!deletedItem) {
      return res.status(404).json({ message: "❌ Cart item not found" });
    }

    // ✅ 2) update pizza inCart false
    const pizzaUpdated = await Pizza.findOneAndUpdate(
      { id: pizzaId },
      { $set: { inCart: false } },
      { new: true }
    );

    res.status(200).json({
      message: "✅ Deleted cart item & updated pizza inCart:false",
      deletedItem,
      pizzaUpdated
    });
  } catch (error) {
    res.status(500).json({
      message: "❌ Error deleting cart item",
      error: error.message
    });
  }
});

module.exports = router;
