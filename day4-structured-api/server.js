require("dotenv").config();
const express = require("express");
const cors = require("cors");

const logger = require("./src/middlewares/logger");
const errorHandler = require("./src/middlewares/errorHandler");
const checkToken = require("./src/middlewares/checkToken");
const taskRouter = require("./src/api/task/task.router");

const app = express();

// Middlewares 
app.use(cors());               // Enable CORS
app.use(express.json());       // Parse JSON body
app.use(logger);               // Custom logger middleware

// Optional token check for all /api routes
app.use("/api", checkToken);

//  Routers
app.use("/api/tasks", taskRouter);

// 404 Handler 
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error Handler 
app.use(errorHandler);

// Server Setup 
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
