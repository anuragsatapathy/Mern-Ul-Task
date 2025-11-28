const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const apiRouter = require("./src/api/api.router");
const { errorHandler } = require("./src/middlewares/errorHandler");

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// API routes
app.use("/api", apiRouter);

// health check
app.get("/", (req, res) => res.json({ message: "Todo Backend is running" }));

// error handler (should be after routes)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



