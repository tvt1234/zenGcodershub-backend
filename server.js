import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173","https://zen-gcoderhubfrontend.vercel.app"], // Vite frontend
  credentials: true
}));
app.use("/api/auth", authRoutes);
app.use("/api/enrollment", enrollmentRoutes);
app.use("/api/payment", paymentRoutes);



connectDB();

app.listen(5000, () => {
  console.log("Server running on port 5000");
});