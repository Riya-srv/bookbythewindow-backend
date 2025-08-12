const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
    publishedYear: {
    type: Number,
    required: true
  },
  genre: {
    type: String,
    enum: ['Fiction', 'Non-Fiction', 'Self-Help', 'Educational'],
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: false
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
    language: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  coverImageUrl: {
    type: String
  }
}, {
  timestamps: true
});

const Book = mongoose.model("Book", BookSchema);
module.exports = Book;

