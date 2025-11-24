const express = require("express");
const app = express();

app.use(express.json()); // to parse JSON body

// Import student routes
const studentRoutes = require("./routes/students");
app.use("/students", studentRoutes);

// Root route
app.get("/", (req, res) => {
    res.json({ message: "Student API Server Running" });
});

// Handle invalid routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

const PORT = 4000; // different port
app.listen(PORT, () => {
    console.log(`Student API Server running at http://localhost:${PORT}`);
});
