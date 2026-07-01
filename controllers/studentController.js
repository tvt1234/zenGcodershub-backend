

import Student from "../models/Student.js";

// ================= CREATE =================
export const createStudent = async (req, res) => {
    try {
        const student = await Student.create(req.body);
        

        res.status(201).json({
            message: "Student created successfully",
            data: student,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating student",
            error: error.message,
        });
    }
};

// ================= GET ALL =================
export const getStudents = async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            data: students
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching students",
            error: error.message,
        });
    }
};

// ================= UPDATE =================
export const updateStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                returnDocument: "after", // ✅ new standard
            }
        );

        res.json({ data: student });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// ================= DELETE =================


export const deleteStudent = async (req, res) => {
    try {
        console.log("Deleting student id:", req.params.id);

        const deleted = await Student.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                message: "Student not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Student deleted successfully",
            id: req.params.id,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting student",
            error: error.message,
        });
    }
};

