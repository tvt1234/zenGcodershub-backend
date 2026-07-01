
import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    message: String,
    status: {
      type: String,
      default: "unread", // unread | read | replied
    },
  },
  { timestamps: true }
);

export default mongoose.model("Contact", contactSchema);