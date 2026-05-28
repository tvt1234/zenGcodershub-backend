import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  mobile: String,
  role: {
    type: String,
    enum: ["student", "teacher", "admin"],
    default: "student"
  }
});

export default mongoose.model("User", userSchema);