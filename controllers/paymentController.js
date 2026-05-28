import Payment from "../models/Payment.js";
import Course from "../models/Course.js";

/**
 * 💳 CREATE PAYMENT (ORDER INIT)
 */
export const createPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.body;

    // check course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    // create payment record
    const payment = await Payment.create({
      user: userId,
      course: courseId,
      amount: course.fee,
      paymentStatus: "pending",
    });

    res.status(201).json({
      msg: "Payment initiated",
      payment,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error creating payment",
      error: error.message,
    });
  }
};

/**
 * ✅ MARK PAYMENT SUCCESS (after gateway callback)
 */
export const successPayment = async (req, res) => {
  try {
    const { paymentId, transactionId } = req.body;

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({ msg: "Payment not found" });
    }

    payment.paymentStatus = "success";
    payment.transactionId = transactionId;

    await payment.save();

    res.json({
      msg: "Payment successful",
      payment,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Payment update failed",
      error: error.message,
    });
  }
};

/**
 * ❌ FAIL PAYMENT
 */
export const failPayment = async (req, res) => {
  try {
    const { paymentId } = req.body;

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({ msg: "Payment not found" });
    }

    payment.paymentStatus = "failed";

    await payment.save();

    res.json({
      msg: "Payment failed",
      payment,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error updating payment",
      error: error.message,
    });
  }
};

/**
 * 📄 GET USER PAYMENTS
 */
export const getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({
      user: req.user.id,
    })
      .populate("course")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({
      msg: "Error fetching payments",
      error: error.message,
    });
  }
};

/**
 * 📊 ADMIN - ALL PAYMENTS
 */
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("user", "name email")
      .populate("course", "title fee")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({
      msg: "Error fetching all payments",
      error: error.message,
    });
  }
};