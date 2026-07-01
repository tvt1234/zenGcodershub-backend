import mongoose from "mongoose";
import Attendance from "../models/Attendance.js";
import User from "../models/User.js";


// Get all students
export const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" });

    res.json(students);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Create Attendance
export const createAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.create(req.body);

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Get Attendance
export const getAttendance = async (req, res) => {
  try {
    const data = await Attendance.find()
      .populate("student")
      .sort({ date: -1 });

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Update Attendance
export const updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.json(attendance);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Delete Attendance
export const deleteAttendance = async (req, res) => {
  try {
    await Attendance.findByIdAndDelete(req.params.id);

    res.json({
      message: "Attendance Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// student looking for Attendance

export const getStudentAttendance = async (req, res) => {
  try {

    const attendance = await Attendance.find({
      student: req.params.id,
    }).sort({ date: -1 });


    res.json(attendance);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
