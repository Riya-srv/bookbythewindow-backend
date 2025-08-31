const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
  title: String,
  price: Number,
  mrp: Number,
  coverImageUrl: String,
  qty: { type: Number, default: 1 }
});


const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;