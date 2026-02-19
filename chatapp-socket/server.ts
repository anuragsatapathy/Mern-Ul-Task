import dotenv from "dotenv";
import express, { Application } from "express";
import http, { Server as HttpServer } from "http";
import cors from "cors";

import connectDB from "./src/config/db";
import apiRouter from "./src/api/api.router";
import initSocket from "./src/config/socket";

dotenv.config();

const app: Application = express();
const server: HttpServer = http.createServer(app);

connectDB();
initSocket(server);

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

const PORT: number = Number(process.env.PORT) || 5000;

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
