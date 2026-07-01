
import amqp from "amqplib";
import { config } from "../config/env.js";

let connection = null;
let channel = null;

const QUEUE_NAME = "email_queue";

/* ================= RABBITMQ INIT ================= */

export const initRabbitMQ = async () => {
  try {
    connection = await amqp.connect(config.RABBITMQ_URL);

    channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, {
      durable: true,
    });

    console.log("✅ RabbitMQ Connected Successfully");

    connection.on("close", () => {
      console.log("⚠️ RabbitMQ Connection Closed");
      channel = null;
    });

    connection.on("error", (err) => {
      console.error("❌ RabbitMQ Error:", err.message);
    });

    return channel;
  } catch (error) {
    console.error(
      "❌ RabbitMQ Connection Failed:",
      error.message
    );

    channel = null;
    return null;
  }
};

/* ================= SEND EMAIL ================= */

export const sendEmail = async (to, subject, html) => {
  try {
    if (!channel) {
      console.log("⚠️ RabbitMQ not connected");
      return false;
    }

    const emailData = {
      to,
      subject,
      html,
      createdAt: new Date(),
    };

    channel.sendToQueue(
      QUEUE_NAME,
      Buffer.from(JSON.stringify(emailData)),
      {
        persistent: true,
      }
    );

    console.log(`📧 Email Queued -> ${to}`);

    return true;
  } catch (error) {
    console.error("❌ Email Queue Error:", error.message);
    return false;
  }
};

/* ================= OTP EMAIL ================= */

export const sendOTPEmail = async (email, otp) => {
  const subject = "Password Reset OTP";

  const html = `
    <div style="font-family: Arial, sans-serif;">
      <h2>Password Reset Request</h2>

      <p>Hello,</p>

      <p>Your OTP for password reset is:</p>

      <h1 style="color:#2563eb;">${otp}</h1>

      <p>This OTP is valid for 10 minutes.</p>

      <p>If you did not request a password reset, please ignore this email.</p>

      <br>

      <p>Regards,</p>
      <p><strong>ZenGCodersHub Team</strong></p>
    </div>
  `;

  return await sendEmail(email, subject, html);
};

/* ================= WELCOME EMAIL ================= */

export const sendWelcomeEmail = async (
  email,
  name,
  role
) => {
  const subject = "Welcome to ZenGCodersHub";

  const html = `
    <div style="font-family: Arial, sans-serif;">
      <h2>Welcome ${name}</h2>

      <p>Your account has been created successfully.</p>

      <p><strong>Role:</strong> ${role}</p>

      <p>You can now login and access your dashboard.</p>

      <br>

      <p>Thank you for joining ZenGCodersHub.</p>
    </div>
  `;

  return await sendEmail(email, subject, html);
};

/* ================= STUDENT ENROLLMENT EMAIL ================= */

export const sendEnrollmentConfirmation = async (
  email,
  studentName,
  courseName
) => {
  const subject = "Course Enrollment Confirmation";

  const html = `
    <div style="font-family: Arial, sans-serif;">
      <h2>Enrollment Successful</h2>

      <p>Hello ${studentName},</p>

      <p>You have successfully enrolled in:</p>

      <h3>${courseName}</h3>

      <p>
        Please login to your student dashboard
        to view course details.
      </p>

      <br>

      <p>Best Regards,</p>
      <p><strong>ZenGCodersHub Team</strong></p>
    </div>
  `;

  return await sendEmail(email, subject, html);
};

/* ================= TEACHER ASSIGNMENT EMAIL ================= */

export const sendTeacherAssignmentEmail = async (
  email,
  teacherName,
  courseName
) => {
  const subject = "Course Assignment Notification";

  const html = `
    <div style="font-family: Arial, sans-serif;">
      <h2>Course Assigned Successfully</h2>

      <p>Hello ${teacherName},</p>

      <p>
        You have been assigned to teach:
      </p>

      <h3>${courseName}</h3>

      <p>
        Please login to your teacher dashboard
        for more details.
      </p>

      <br>

      <p>Regards,</p>
      <p><strong>ZenGCodersHub Team</strong></p>
    </div>
  `;

  return await sendEmail(email, subject, html);
};

/* ================= EXPORTS ================= */

export default {
  initRabbitMQ,
  sendEmail,
  sendOTPEmail,
  sendWelcomeEmail,
  sendEnrollmentConfirmation,
  sendTeacherAssignmentEmail,
};