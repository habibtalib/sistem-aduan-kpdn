// config/db.js
// Modul ini menguruskan sambungan ke pangkalan data MongoDB menggunakan Mongoose.

const mongoose = require("mongoose");

/**
 * Sambung ke MongoDB menggunakan connection string dari fail .env (MONGODB_URI).
 */
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Berjaya sambung ke MongoDB");
  } catch (error) {
    console.error("❌ Gagal sambung ke MongoDB:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
