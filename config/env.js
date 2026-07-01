


import dotenv from "dotenv";
dotenv.config();

export const config = {
  RABBITMQ_URL: process.env.RABBITMQ_URL,
  REDIS_URL: process.env.REDIS_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
};