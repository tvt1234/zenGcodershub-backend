
import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  title: String,
  subject: String,
  description: String,
  teacherName: String,

  dueDate: Date,

  students: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  ],

  isAll: { type: Boolean, default: false },
});

export default mongoose.model("Assignment", assignmentSchema);