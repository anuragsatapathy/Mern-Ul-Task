require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./src/config/db");
const apiRouter = require("./src/api/api.router");

const app = express();
app.use(cors());
app.use(express.json());


console.log("Server.js: API Router loaded!");

// API Base Route
app.use("/api", apiRouter);

// Health Check
app.get("/", (req, res) => {
  res.json({ message: "Issue Tracking Backend is running!" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({
    isSuccess: false,
    message: "Internal server error",
    code: 500,
    data: null,
  });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

(async () => {
  try {
    await connectDB(MONGO_URI);
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err.message || err);
    process.exit(1);
  }
})();

