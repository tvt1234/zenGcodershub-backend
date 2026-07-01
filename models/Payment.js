import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
    },

    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String,

    amount: Number,

    currency: {
      type: String,
      default: "INR",
    },

    paymentStatus: {
      type: String,
      enum: ["created", "captured", "failed"],
      default: "created",
    },
    method: String, // card, upi, netbanking
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);