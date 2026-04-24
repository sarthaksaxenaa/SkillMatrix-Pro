/**
 * MongoDB connection configuration.
 * Connects to MongoDB using the URI from environment variables.
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("[OK] MongoDB Connected Successfully");
  } catch (err) {
    console.log("[ERROR] MongoDB Connection Error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
