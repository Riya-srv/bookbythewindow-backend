const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    enum: ['Fiction', 'Non-Fiction', 'Self-Help', 'Educational'],
    required: true
  }
});

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
