import express from "express";
import {
  createPayment,
  successPayment,
  failPayment,
  getUserPayments,
  getAllPayments,
} from "../controllers/paymentController.js";

import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * 💳 Create payment
 */
router.post("/create", auth, createPayment);

/**
 * ✅ Success payment callback
 */
router.post("/success", auth, successPayment);

/**
 * ❌ Fail payment
 */
router.post("/fail", auth, failPayment);

/**
 * 📄 User payments
 */
router.get("/my", auth, getUserPayments);

/**
 * 📊 Admin all payments
 */
router.get("/all", auth, getAllPayments);

export default router;