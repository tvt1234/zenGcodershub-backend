import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },

 paymentStatus: {
  type: String,
  enum: ["pending", "paid"],
  default: "pending",
},
status: {
  type: String,
  enum: ["enrolled", "not_enrolled"],
  default: "not_enrolled",
},

  progress: { type: Number, default: 0 },
});

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

export default Enrollment;   // ✅ THIS IS IMPORTANT