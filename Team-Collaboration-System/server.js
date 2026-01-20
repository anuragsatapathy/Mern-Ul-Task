require("dotenv").config();
const express = require("express");
const apiRouter = require("./src/api/api.router");

const app = express();
app.use(express.json());

app.use("/api", apiRouter);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
