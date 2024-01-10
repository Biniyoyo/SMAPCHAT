/* eslint-disable */
const mongoose = require("mongoose");
const User = require("./model/UserModel.js");

/**
 * Start the database and create a default admin if it doesn't exist
 */
async function startDB() {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB Atlas");

    // Temporary behavior to create dummy user
    const admin = await User.findByEmail("admin@test.com");

    if (admin === null) {
      User.createUser("admin@test.com", "admin", process.env.ADMIN_PASS, "");
    }
  } catch (error) {
    console.error("Connection to MongoDB Atlas failed:", error.message);
  }
}

module.exports = startDB;
