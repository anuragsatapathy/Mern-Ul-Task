const express = require("express");
const router = express.Router();

// Sample student data
let students = [
    { id: 1, name: "Anurag", age: 23 },
    { id: 2, name: "Neha", age: 21 }
];

// GET all students
router.get("/", (req, res) => {
    console.log("GET /students called");
    res.json(students);
});

// GET student by ID
router.get("/:id", (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (!student) return res.status(404).json({ message: "Student not found" });
    console.log(`GET /students/${req.params.id} called`);
    res.json(student);
});

// POST new student
router.post("/", (req, res) => {
    const newStudent = {
        id: students.length + 1,
        name: req.body.name,
        age: req.body.age
    };
    students.push(newStudent);
    console.log("POST /students called", newStudent);
    res.json(newStudent);
});

// PUT update student by ID
router.put("/:id", (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (!student) return res.status(404).json({ message: "Student not found" });

    student.name = req.body.name || student.name;
    student.age = req.body.age || student.age;
    console.log(`PUT /students/${req.params.id} called`, student);
    res.json(student);
});

// DELETE student by ID
router.delete("/:id", (req, res) => {
    const index = students.findIndex(s => s.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: "Student not found" });

    const deleted = students.splice(index, 1);
    console.log(`DELETE /students/${req.params.id} called`, deleted);
    res.json(deleted[0]);
});

module.exports = router;
