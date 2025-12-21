import express from "express";
import studentRoutes from "./student/routes/student.routes.js";

const app = express();
app.use(express.json());

//routes
app.use("/students", studentRoutes);

//invalid routes
app.use((req,res)=>{
    res.status(404).json({message : "Route not found"});
});

const PORT =3000;
app.listen(PORT, ()=>{
    console.log(`server running on http://localhost:${PORT}`);
});