
import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    examType: {
      type: String,
      enum: ["Unit Test", "Midterm", "Final"],
      required: true,
    },

    marksObtained: {
      type: Number,
      required: true,
    },

    totalMarks: {
      type: Number,
      required: true,
    },

    percentage: {
      type: Number,
    },

    grade: {
      type: String,
    },

    resultStatus: {
      type: String,
      enum: ["Pass", "Fail"],
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Result", resultSchema);