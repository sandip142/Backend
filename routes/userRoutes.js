const express = require("express");
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
const upload = require("../middleware/multer");

const router = express.Router();

router.post("/signup", upload.single("fileUrl"), async (req, res) => {
  const { firstName, lastName, dob, address, email, password } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !dob || !address || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Check if email is already registered
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    // File upload validation
    if (!req.file) {
      return res.status(400).json({ error: "Please upload a profile image." });
    }

    // Upload file to Cloudinary
    const file = req.file;
    const result = await cloudinary.uploader.upload(file.path);

    // Create new user
    const user = new User({
      firstName,
      lastName,
      dob,
      address,
      email,
      password,
      fileUrl: result.secure_url,  // Only storing the secure URL from Cloudinary
    });

    // Save user to the database
    await user.save();

    // Respond with success
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error.message);

    // Return specific error if the file upload fails
    if (error.message.includes("Cloudinary")) {
      return res.status(500).json({ error: "Error uploading file to Cloudinary" });
    }

    // General error handler
    res.status(500).json({ error: "An error occurred while registering the user" });
  }
});

module.exports = router;
