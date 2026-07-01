
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

  role: {
    type: String,
    enum: ["teacher", "student", "admin"],
    default: "student",
  },

  mobile: String,

  profile: {
    address: {
      type: String,
      default: "",
    },

    class: {
      type: String,
      default: "",
    },

    subject: {
      type: String,
      default: "",
    },
  },
});

export default mongoose.model("User", userSchema);