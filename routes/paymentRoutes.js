import express from "express";
import {
  createOrder,
  verifyPayment,
  downloadReceiptPDF,
  razorpayWebhook,
} from "../controllers/paymentController.js";

import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-order", auth, createOrder);

router.post("/verify-payment", auth, verifyPayment);
router.get("/receipt/pdf/:courseId",auth,downloadReceiptPDF);

router.post("/webhook", razorpayWebhook);

export default router;