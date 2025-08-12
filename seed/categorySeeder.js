const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Category = require("../models/category.models"); 
const {initializeDatabase} = require("../db/db.connect")

dotenv.config();

const categoryData = [
  { name: "Mystery & Thriller", genre: "Fiction" },
  { name: "Fantasy", genre: "Fiction" },
  { name: "Romance & Comedy", genre: "Fiction" },
  { name: "Quick Reads", genre: "Fiction" },
  { name: "Biography", genre: "Non-Fiction" },
  { name: "Health Fitness Diet", genre: "Non-Fiction" },
  { name: "Philosophy", genre: "Non-Fiction" },
  { name: "Self-Improvement", genre: "Self-Help" },
  { name: "Mindfulness & Spirituality", genre: "Self-Help" },
  { name: "History", genre: "Educational" },
  { name: "Finance", genre: "Educational" },
  { name: "Technology", genre: "Educational" },
  { name: "Marketing & Advertising", genre: "Educational" }
];

const seedCategories = async () => {
  try {
    await initializeDatabase(); 
    const inserted = await Category.insertMany(categoryData);
    console.log("Categories seeded:", inserted.length);
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding categories:", error);
    mongoose.connection.close();
  }
};

seedCategories();
