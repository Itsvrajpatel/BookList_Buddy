const Book = require('../models/Book');


// Get all books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({ userId: req.user.userId });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
};

// Get single book
exports.getBook = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book', error: error.message });
  }
};

// Create book
exports.createBook = async (req, res) => {
  try {
    const { title, author, description, publishedYear } = req.body;
    const book = new Book({
      title,
      author,
      description,
      publishedYear,
      userId: req.user.userId
    });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error creating book', error: error.message });
  }
};

// Update book
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error updating book', error: error.message });
  }
};

// Delete book
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting book', error: error.message });
  }
};