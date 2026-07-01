
import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subject: { type: String, required: true },
    experience: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Teacher", teacherSchema);