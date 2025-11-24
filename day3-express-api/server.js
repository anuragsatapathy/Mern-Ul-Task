// const http = require("http"); // commented old server
const express = require("express");
const app = express();

app.use(express.json()); // to parse JSON request body

app.get("/", (req, res) => {
    res.json({ message: "Server is running with Express" });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
