const express = require("express");
const cors = require("cors");
const path = require("path");   
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/swagger");



require("dotenv").config();

const apiRouter = require("./src/api/api.router");
const connectDB = require("./src/config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


connectDB();

app.use("/api", apiRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
