require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/db");

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// Import routers
const userRouter = require("./src/api/user/user.router");
const profileRouter = require("./src/api/profile/profile.router");

// Routes
app.use("/api/users", userRouter);
app.use("/api/profiles", profileRouter);

// Test route
app.get("/", (req, res) => res.send("API is running..."));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

