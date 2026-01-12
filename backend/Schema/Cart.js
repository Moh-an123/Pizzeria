const mongoose = require("mongoose");

const IngredientSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    tname: { type: String, required: true },
  },
  { _id: false }
);

const ToppingSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    tname: { type: String, required: true },
    price: { type: String, required: true },
  },
  { _id: false }
);

const CartSchema = new mongoose.Schema(
  {
    id: { type: String, required: true }, // "0001"
    type: { type: String, required: true }, // veg/nonveg
    price: { type: String, required: true }, // "290"
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },

    inCart: { type: Boolean, default: false },

    ingredients: { type: [IngredientSchema], default: [] },

    topping: { type: [ToppingSchema], default: [] },

    quantity: { type: String, default: "1" }, // string quantity
   
    addedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema, "Cart");

