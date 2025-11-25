const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URL; 

    if (!uri) {
      throw new Error("MONGO_URL is missing in .env file");
    }

    await mongoose.connect(uri, {});
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = { connectDB };

