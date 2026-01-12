const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const cartPostRoute = require("./Routes/CartPost");
const cartGetRoute = require("./Routes/CartGet");
const cartDeleteAllRoute = require("./Routes/CartDelete");
const cartRoutes = require("./Routes/CartUpdate");
const deleteById = require("./Routes/DeleteById");

const app = express();
const PORT = 3000;

// ✅ middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB Atlas connection
// const MONGO_URI = `mongodb://localhost:27017/Pizzaeria`;

const MONGO_URI = process.env.MONGO_URI;


mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully (Atlas)"))
  .catch((err) => console.log("❌ MongoDB connection error:", err.message));

// ✅ Test rout
app.get("/", (req, res) => {
  res.send("✅ Backend running + MongoDB connected");
});


app.get("/api/collections", async (req, res) => {
  try {
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    res.json(collections.map((c) => c.name));
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error listing collections", error: error.message });
  }
});

app.use("/api/cart", cartPostRoute);
app.use("/api/cart", cartGetRoute);
app.use("/api/cart", cartDeleteAllRoute);
app.use("/api/cart", cartRoutes);
app.use("/api/cart", deleteById);

app.get("/api/pizzas", async (req, res) => {
  // console.log("pizza");

  try {
    const pizzas = await mongoose.connection.db
      .collection("pizzas")
      .find({})
      .toArray();
    res.status(200).json(pizzas);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching pizzas", error: error.message });
  }
});

app.get("/api/ingredients", async (req, res) => {
  try {
    const ingredients = await mongoose.connection.db
      .collection("Ingredients")
      .find({})
      .toArray();

    res.status(200).json(ingredients);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching ingredients", error: error.message });
  }
});
app.put("/api/pizzas/:id", async (req, res) => {
  try {
    const pizzaId = req.params.id; // "0001"
    const { inCart } = req.body; // true/false

    const result = await mongoose.connection.db.collection("pizzas").updateOne(
      { id: pizzaId }, // ✅ match pizza by id
      { $set: { inCart: inCart } }
    );

    res.status(200).json({
      message: "✅ Pizza inCart updated",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "❌ Error updating pizza inCart",
      error: error.message,
    });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
