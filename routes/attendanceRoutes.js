
import express from "express";
import {
  createAttendance,
  getAttendance,
  updateAttendance,
  deleteAttendance,
  getStudents,
  getStudentAttendance,
} from "../controllers/attendanceController.js";

const router = express.Router();

router.get("/students", getStudents);

router.get("/", getAttendance);

router.get("/student/:id", getStudentAttendance);

router.post("/", createAttendance);

router.put("/:id", updateAttendance);

router.delete("/:id", deleteAttendance);

export default router;