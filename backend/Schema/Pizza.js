const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema(
  {
    id: String,
    tname: String
  },
  { _id: false }
);

const toppingSchema = new mongoose.Schema(
  {
    id: String,
    tname: String,
    price: String
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },  // pizza id
    type: { type: String, enum: ["veg", "non-veg"], required: true },

    price: { type: String, required: true },
    name: { type: String, required: true },

    image: String,
    description: String,

    ingredients: { type: [ingredientSchema], default: [] },
    topping: { type: [toppingSchema], default: [] },

    // ✅ quantity in cart
    inCart: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("pizzas", cartSchema);
