import students from "../data/student.data.js";

//LIST
export const getAllStudents = (req, res) => {
    console.log("get all students");
    res.status(200).json(students);
};

// READ
export const getStudentById = (req,res) =>{
    const student = students.find(
        s => s.id === Number(req.params.id)
    );

    if(!student){
        return res.status(404).json({message : "student not found"});
    }

    res.json(student);
};

// CREATE
export const createStudent = (req,res) => {

    const {name, course} = req.body;

    const newStudent = {
        id : students.length + 1,
        name,
        course
    };
    students.push(newStudent);
    res.status(201).json(newStudent);

};
    
// UPDATE
export const updateStudent = (req, res) => {
    const student = students.find(
        s => s.id === Number(req.params.id)
    );

    if(!student){
        return res.status(404).json({message : "student not found"});
    }
    student.name = req.body.name || student.name;
    student.course = req.body.course || student.course;
    res.json(student);
}

// DELETE
export const deleteStudent = (req, res) => {
    const index = students.findIndex(
        s => s.id === Number(req.params.id)
    );

    if(index === -1){
        return res.status(404).json({message : "student not found"});
    }

    students.splice(index, 1);
    res.json({message : "student deleted"});
};
