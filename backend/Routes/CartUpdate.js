const express = require("express");
const router = express.Router();
const Cart = require("../Schema/Cart");

// ✅ Update quantity (important API)
router.put("/quantity/:id", async (req, res) => {
    console.log(req.params.id, req.body);
    
  try {
    const { quantity } = req.body;
 
    const updated = await Cart.findOneAndUpdate(
     { id: req.params.id },
      { $set: { quantity: quantity } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Item not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});

module.exports = router;
