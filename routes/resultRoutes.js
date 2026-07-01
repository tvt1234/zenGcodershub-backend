
import express from "express";
import {
  createResult,
  getTeacherResults,
  getResultById,
  updateResult,
  deleteResult,
  getMyResults,
} from "../controllers/resultController.js";

import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", auth, createResult);

router.get("/", auth, getTeacherResults);

// 🔥 STATIC ROUTE FIRST
router.get("/my-results", auth, getMyResults);

// 🔥 PARAM ROUTE LAST
router.get("/:id", auth, getResultById);

router.put("/:id", auth, updateResult);

router.delete("/:id", auth, deleteResult);

export default router;