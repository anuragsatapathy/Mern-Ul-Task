require("dotenv").config();
const express = require("express");
const apiRouter = require("./src/api/api.router");
const swaggerConfig = require("./src/config"); 

const app = express();

app.use(express.json());

// API routes
app.use("/api", apiRouter);

// Swagger docs
swaggerConfig(app);

app.listen(5000, () => {
  console.log("Server running on port 5000");
  console.log("Swagger docs available at http://localhost:5000/api/docs");
});
