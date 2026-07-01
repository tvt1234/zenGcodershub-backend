

import PDFDocument from "pdfkit";
import Payment from "../models/Payment.js";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";


import { razorpay } from "../config/razorpay.js";
import crypto from "crypto";



// ================= CREATE ORDER =================
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    console.log("AMOUNT:", amount);
    console.log("KEY ID:", process.env.RAZORPAY_KEY_ID);
    console.log("SECRET:", process.env.RAZORPAY_KEY_SECRET);

    const order = await razorpay.orders.create({
      amount: Number(amount) * 100,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    return res.json(order);

  } catch (err) {
    console.log("❌ FULL RAZORPAY ERROR:", err);
    return res.status(500).json({
      message: "Order creation failed",
      error: err.message,
    });
  }
};
// ================= VERIFY PAYMENT =================


export const verifyPayment = async (req, res) => {
  try {
    console.log("USER:", req.user);
    console.log("BODY:", req.body);

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
      amount,
    } = req.body;

    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing payment data" });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }
  await Payment.create({
  user: req.user._id,
  course: courseId,
  amount,
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  currency: "INR",
  paymentStatus: "captured",
});
    await Enrollment.create({
      user: req.user._id,
      course: courseId,
      status: "enrolled",
      paymentStatus: "paid",
    });

    res.json({
      success: true,
      message: "Payment verified successfully",
    });

  } catch (err) {
    console.log("VERIFY ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// ================= WEBHOOK =================
export const razorpayWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const signature = req.headers["x-razorpay-signature"];

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(400).send("Invalid webhook signature");
    }

    const event = req.body.event;

    if (event === "payment.captured") {
      const payment = req.body.payload.payment.entity;

      const enrollmentId = payment.notes?.enrollmentId;

      if (enrollmentId) {
        await Enrollment.findByIdAndUpdate(enrollmentId, {
          paymentStatus: "paid",
          status: "enrolled",
        });
      }
    }

    res.status(200).json({ success: true });

  } catch (err) {
    console.log("WEBHOOK ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};






export const downloadReceiptPDF = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const payment = await Payment.findOne({
      user: userId,
      course: courseId,
    });

    if (!payment) {
      return res.status(404).json({ message: "Receipt not found" });
    }

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${user.name}-${course.title}-receipt.pdf`
    );

    doc.pipe(res);

    // HEADER
    doc.fontSize(22).text("ZenG Coders Hub", { align: "center" });
    doc.moveDown();

    doc.fontSize(16).text("PAYMENT RECEIPT", { align: "center" });
    doc.moveDown(2);

    // STUDENT INFO
    doc.fontSize(12).text(`Student Name: ${user.name}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Mobile: ${user.mobile}`);
    doc.moveDown();

    // COURSE INFO
    doc.text(`Course Name: ${course.title}`);
    doc.text(`Amount: ₹${course.salePrice || course.originalPrice}`);
    doc.text(`Currency: INR`);
    doc.moveDown();

    // PAYMENT INFO
    doc.text(`Order ID: ${payment.razorpay_order_id}`);
    doc.text(`Payment ID: ${payment.razorpay_payment_id}`);
    doc.text(`Status: ${payment.paymentStatus}`);
    doc.moveDown();

    // DATE
    doc.text(`Date: ${new Date(payment.createdAt).toDateString()}`);

    doc.moveDown(2);
    doc.text("Thank you for your purchase!", {
      align: "center",
    });

    doc.end();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};