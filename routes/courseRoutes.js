import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCoursesByTeacher,
} from "../controllers/courseController.js";

import { auth } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * 📚 CREATE COURSE
 * Only teacher or admin can create
 */
router.post(
  "/create",
  auth,
  roleMiddleware("teacher", "admin"),
  createCourse
);

/**
 * 📖 GET ALL COURSES (PUBLIC)
 */
router.get("/", getAllCourses);

/**
 * 📄 GET SINGLE COURSE (PUBLIC)
 */
router.get("/:id", getCourseById);

/**
 * ✏️ UPDATE COURSE
 * Only teacher (owner) or admin
 */
router.put(
  "/:id",
  auth,
  roleMiddleware("teacher", "admin"),
  updateCourse
);

/**
 * 🗑️ DELETE COURSE
 * Only admin OR teacher
 */
router.delete(
  "/:id",
  auth,
  roleMiddleware("admin", "teacher"),
  deleteCourse
);

/**
 * 👨‍🏫 TEACHER DASHBOARD COURSES
 * Only teacher
 */
router.get(
  "/teacher/my",
  auth,
  roleMiddleware("teacher"),
  getCoursesByTeacher
);

export default router;