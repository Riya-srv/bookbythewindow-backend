require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('../models/book.models');
const Category = require('../models/category.models');
const { initializeDatabase } = require('../db/db.connect');
const books = require('../booksData.json'); 

const seedBooks = async () => {
  try {
    await initializeDatabase();

    const categories = await Category.find();
    const categoryMap = {};
    categories.forEach((cat) => {
      categoryMap[cat.name] = cat._id.toString();
    });

    const updatedBooks = books.map((book) => ({
      ...book,
      category: categoryMap[book.category],
    }));

    await Book.deleteMany();
    await Book.insertMany(updatedBooks);

    console.log('Book data seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding books:', error);
    process.exit(1);
  }
};

seedBooks();
