const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
    title: String,
    author: String,
    price: Number,
    image: String,
}, { timestamps: true });

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
module.exports = Wishlist;