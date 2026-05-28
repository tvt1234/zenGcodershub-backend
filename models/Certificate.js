import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  userName: String,
  courseName: String,
  issueDate: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Certificate", certificateSchema);