
import express from "express";
import { auth} from "../middleware/authMiddleware.js";

import {
  updateMyProfile,
  adminUpdateUser,
  getStudents,
  searchStudents,
} from "../controllers/userController.js";

const router = express.Router();

// PROFILE
router.put("/me", auth, updateMyProfile);

// ADMIN UPDATE
router.put("/admin/:id", auth, adminUpdateUser);

// STUDENTS LIST
router.get("/students", auth, getStudents);

// SEARCH STUDENTS
router.get("/students/search",auth, searchStudents);

export default router;