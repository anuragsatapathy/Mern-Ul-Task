const mongoose = require("mongoose");

const connectDB = async (mongoUri) => {
  try {
    if (!mongoUri) throw new Error("MONGO_URI is required");

    await mongoose.connect(mongoUri);

    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    throw err;
  }
};

module.exports = connectDB;

