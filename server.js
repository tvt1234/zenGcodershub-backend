import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import { initRedis } from "./services/redis.js";
import { initRabbitMQ } from "./services/rabbitmq.js";

// import dashboardRoutes from "./routes/dashboardRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js"; // <-- Add if exists
import courseRoutes from "./routes/courseRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();




const app = express();

/* ================= MIDDLEWARE ================= */

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://zen-gcoderhubfrontend.vercel.app",
      "https://www.genzcodershub.in",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

/* ================= DATABASE & SERVICES ================= */

try {
  await connectDB();

  // Redis
  await initRedis();

  // RabbitMQ
  await initRabbitMQ();

} catch (error) {
  console.error("❌ Service Initialization Error:", error);
}

/* ================= ROUTES ================= */

// app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/contact", contactRoutes);

/* ================= HEALTH CHECK ================= */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ZenGCodersHub Backend Running Successfully",
  });
});

/* ================= START SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});