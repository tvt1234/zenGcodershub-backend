import express from "express";
import {
  enrollCourse,
  getMyEnrollments,
  updateProgress,
  unenrollCourse,
} from "../controllers/enrollmentController.js";

import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * 🎓 Student enrolls in course
 */
router.post("/enroll", auth, enrollCourse);

/**
 * 📚 Student dashboard - my courses
 */
router.get("/my", auth, getMyEnrollments);

/**
 * 📊 Update course progress
 */
router.put("/progress", auth, updateProgress);

/**
 * ❌ Unenroll course
 */
router.delete("/unenroll", auth, unenrollCourse);

export default router;