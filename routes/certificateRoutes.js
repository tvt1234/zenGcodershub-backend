import express from "express";
import {
  generateCertificate,
  getUserCertificates,
  verifyCertificate,
} from "../controllers/certificateController.js";

import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate", auth, generateCertificate);
router.get("/my", auth, getUserCertificates);
router.get("/verify/:certificateId", verifyCertificate);

export default router;