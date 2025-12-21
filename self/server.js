const express = require("express");
require("dotenv").config();

const apiRouter = require("./Userexample/src/api/api.router");
const connectDB = require("./Userexample/src/config/db");

const app = express();
app.use(express.json());

connectDB();

app.use("/api", apiRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
