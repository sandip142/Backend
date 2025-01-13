const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');  // Import CORS package
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();

// Middleware to parse JSON and form data
app.use(express.json()); // For JSON data
app.use(express.urlencoded({ extended: true })); // For form URL-encoded data

// Enable CORS for all origins (or specify origins as needed)
app.use(cors()); // This allows all domains, for more specific control, you can pass an options object

// Routes
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

// Database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected...');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.log(error));
