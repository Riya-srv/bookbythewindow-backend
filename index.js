const express = require("express");
const { initializeDatabase } = require("./db/db.connect");
const Books = require("./models/book.models");
const Categories = require("./models/category.models")
const Wishlist = require("./models/wishlist.models")
const Orders = require("./models/orders.models");

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

app.get("/api/books/genre/all", async (req, res) => {
  try {
    const books = await Books.find(); // fetch all books
    res.json({ data: { books }});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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

app.get("/api/books/genre/all", async (req, res) => {
  try {
    const books = await Books.find(); // fetch all books
    res.json({ data: { books }});
  } catch (error) {
    res.status(500).json({ message: error.message });
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


// Add to wishlist
app.post("/api/wishlist", async (req, res) => {
    try {
        const item = new Wishlist(req.body);
        console.log(item)
        const saved = await item.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get wishlist
app.get("/api/wishlist", async (req, res) => {
    const items = await Wishlist.find();
    res.json(items);
});

// Delete item
app.delete("/api/wishlist/:id", async (req, res) => {
    await Wishlist.findByIdAndDelete(req.params.id);
    res.json({ message: "Item removed" });
});

//CART APIs

const Cart = require("./models/cart.models");

// Add to cart
app.post("/api/cart", async (req, res) => {
  try {
    const { bookId, title, price, mrp, coverImageUrl } = req.body;

    // check if already exists
    let existing = await Cart.findOne({ bookId });
    if (existing) {
      existing.qty += 1;
      const updated = await existing.save();
      return res.status(200).json(updated);
    }

    else{
      const newItem = new Cart({ bookId, title, price, mrp, coverImageUrl });
      await newItem.save();
    }
    const cart = await Cart.find();
    res.status(200).json({ cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all cart items
// app.get("/api/cart", async (req, res) => {
//   try {
//     const items = await Cart.find();
//     res.json({ cart:items });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch cart" });
//   }
// });

// Add to cart
app.post("/api/cart", async (req, res) => {
  try {
    const { bookId, title, price, qty, coverImageUrl } = req.body;

    // check if already exists
    let existing = await Cart.findOne({ bookId });
    if (existing) {
      existing.qty += 1;
      await existing.save();
    } else {
      const newItem = new Cart({ bookId, title, price, qty, coverImageUrl });
      await newItem.save();
    }

    // Always return the full cart
    const cart = await Cart.find();
    res.status(200).json({ cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Update quantity
app.post("/api/cart/:id", async (req, res) => {
  try {
    const { qty } = req.body;
    if (qty < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1" });
    }
    const updated = await Cart.findByIdAndUpdate(req.params.id,{ qty },{ new: true });
    const cart = await Cart.find();
    res.json({ cart }); 
  } catch (err) {
    res.status(500).json({ error: "Failed to update quantity" });
  }
});

// Remove from cart
app.delete("/api/cart/:id", async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    const cart = await Cart.find();
    res.json({ cart }); 
  } catch (err) {
    res.status(500).json({ error: "Failed to remove item" });
  }
});

// Place new order
app.post("/api/orders", async (req, res) => {
  try {
    const { books, address, total } = req.body;
if (!books || books.length === 0 || !address || address.trim() === "" || !total || total <= 0) {
  return res.status(400).json({ error: "Books, Address and Total Price are required" });
}


    const order = new Orders({
      books,
      address, 
      total
    });

    await order.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to place order" });
  }
});

// Get all orders
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Orders.find().sort({ date: -1 }); 
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});