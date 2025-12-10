const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./src/config/db");
const apiRouter = require("./src/api/api.router");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// connect database
connectDB();

app.use("/api", apiRouter);

app.get("/", (req, res) => {
  res.send("API Working...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
