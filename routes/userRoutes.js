const express = require("express");
const User = require("../models/User");

const router = express.Router();

// POST /signup - Register a new user
router.post("/signup", async (req, res) => {
  const { firstName, lastName, dob, address, email, password } = req.body;

  
  if (!firstName || !lastName || !dob || !address || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  // Validate password strength
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error: "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character.",
    });
  }

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    // Create and save the user
    const user = new User({ firstName, lastName, dob, address, email, password });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ error: "An error occurred while registering the user" });
  }
});

module.exports = router;
