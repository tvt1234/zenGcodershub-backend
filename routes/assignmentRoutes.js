
import express from "express";
import {
  createAssignment,
  getAssignments,
  updateAssignment,
  deleteAssignment,
  getStudentAssignments   // ✅ ADD THIS
} from "../controllers/assignmentController.js";

const router = express.Router();

router.post("/", createAssignment);
router.get("/", getAssignments);
router.put("/:id", updateAssignment);
router.delete("/:id", deleteAssignment);

// ✅ FIXED ROUTE
router.get("/student/:id", getStudentAssignments);

export default router;