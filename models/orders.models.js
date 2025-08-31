const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  books: [
    {
      bookId: String,
      title: String,
      price: Number,
      qty: Number,
      coverImageUrl: String,
    }
  ],
  address: { type: String, required: true }, 
  total: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

const Orders = mongoose.model("Orders", orderSchema);
module.exports = Orders;

