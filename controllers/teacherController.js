
import Teacher from "../models/Teacher.js";
import User from "../models/User.js";


// CREATE
export const createTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.create(req.body);

    res.status(201).json({
      message: "Teacher created successfully",
      data: teacher,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL
export const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();

    res.json({
      message: "Teachers fetched",
      data: teachers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Teacher updated",
      data: teacher,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
export const deleteTeacher = async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);

    res.json({
      message: "Teacher deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" });

    console.log("🔥 STUDENTS FROM DB:", students);

    res.json({
      success: true,
      students: students,
    });
  } catch (err) {
    console.log("❌ ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};