require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./src/routes/authRoutes');
const bookRoutes = require('./src/routes/bookRoutes');
const errorHandler = require('./src/middleware/error');


const app = express();
const PORT = 3001;

// Middleware 
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
