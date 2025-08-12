const express = require("express");
const { initializeDatabase } = require("./db/db.connect");
const Books = require("./models/book.models");
const Categories = require("./models/category.models")
const cors = require("cors");
require("dotenv").config();
initializeDatabase();

const app = express();

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(express.json());
app.use(cors(corsOptions));

//Functionality 1
app.get("/api/books", async (req, res) => {
  try {
    const books = await Books.find();
    res.json({ data: { books } });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books." });
  }
});

// Functionality 2



async function readBookByTitle(bookTitle) {
  try {
    const book = await Books.find({title: bookTitle});
    return book;
  } catch (error) {
    console.log(error);
  }
}

app.get("/api/books/:bookTitle", async (req, res) => {
  try {
    const book = await readBookByTitle(req.params.bookTitle);

    if (book) {
      res.json({ data: { book }});
    } else {
      res.status(404).json({ error: "Book not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch book." });
  }
});

async function readBookById(bookId) {
  try {
    const book = await Books.findById(bookId);
    return book;
  } catch (error) {
    console.log(error);
  }
}

app.get("/api/book/:bookId", async (req, res) => {
  try {
    const book = await readBookById(req.params.bookId);

    if (book) {
      res.json({ data: { book }});
    } else {
      res.status(404).json({ error: "Book not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch book." });
  }
});

async function readBookByGenre(genreName){
  try{
    const books = await Books.find( {genre: genreName})
    return books;
  }catch (error) {
    console.log(error);
  }
}

app.get("/api/books/genre/:genreName", async (req,res) => {
  try{
    const books = await readBookByGenre(req.params.genreName)
   if (books && books.length > 0) {
      res.json({ data: { books }});
    } else {
      res.status(404).json({ error: "Books not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books." });
  }
})

// Functionality 3

app.get("/api/genres", async (req, res) => {
  try {
    const genres = await Books.distinct("genre"); 
    res.json({ data: { genres } });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch genres." });
  }
});

app.get('/api/categories/genre/:genre', async (req, res) => {
  try {
    const genre = req.params.genre;
    const categories = await Categories.find({ genre }); 
    res.status(200).json({ data: { categories } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.get("/api/categories", async (req, res) => {
  try {
    const categories = await Categories.find();
    res.json({ data: { categories }});
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch book genre categories." });
  }
});

async function readCategoryById(categoryId) {
  try {
    const category = await Categories.findById(categoryId);
    return category;
  } catch (error) {
    console.log(error);
  }
}

app.get("/api/books/genre/:genreName/category/:categoryId", async (req, res) => {
  try {
    const { genreName, categoryId } = req.params;
    const books = await Books.find({
      genre: genreName,
      category: categoryId
    }).populate("category"); 
    if (books.length > 0) {
      res.json({ data: { books } });
    } else {
      res.status(404).json({ error: "No books found for this genre and category." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books." });
  }
});


// app.get("/api/categories/:categoryId", async (req, res) => {
//   try {
//     const category = await readCategoryById(req.params.categoryId);

//     if (category) {
//       res.json({ data: { category }});
//     } else {
//       res.status(404).json({ error: "Category not found." });
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch category." });
//   }
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});