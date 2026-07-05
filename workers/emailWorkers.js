
import amqp from "amqplib";
import nodemailer from "nodemailer";
import { config } from "../config/env.js";

const QUEUE_NAME = "email_queue";

const startWorker = async () => {
  try {
    console.log("🚀 Starting Email Worker...");

    console.log("EMAIL_USER =", config.EMAIL_USER);
    console.log("EMAIL_PASS =", config.EMAIL_PASS ? "OK" : "MISSING");

    if (!config.EMAIL_USER || !config.EMAIL_PASS) {
      throw new Error("EMAIL credentials missing");
    }

    const connection = await amqp.connect(config.RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: true });

    console.log("[Worker] Waiting for messages...");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();
    console.log("✅ SMTP Connected");


    

    channel.consume(QUEUE_NAME, async (msg) => {
      if (!msg) return;

      const emailData = JSON.parse(msg.content.toString());

      try {
        await transporter.sendMail({
          from: config.EMAIL_USER,
          to: emailData.to,
          subject: emailData.subject,
          html: emailData.html,
        });

        console.log("📩 Email Sent:", emailData.to);
        channel.ack(msg);
      } catch (err) {
        console.error("❌ Email Error:", err.message);
        channel.nack(msg);
      }
    });
  } catch (error) {
    console.error("❌ Worker Error:", error.message);
  }
};

startWorker();