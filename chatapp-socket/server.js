require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");

const connectDB = require("./src/config/db");
const apiRouter = require("./src/api/api.router");
const initSocket = require("./src/config/socket");

const app = express();
const server = http.createServer(app);

connectDB();
initSocket(server);

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));
