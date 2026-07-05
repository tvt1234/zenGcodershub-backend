
import { createClient } from "redis";
import { config } from "../config/env.js";

let redisClient = null;

/**
 * Initialize Redis Connection
 */
export const initRedis = async () => {
  try {
    redisClient = createClient({
      socket: {
        host: config.REDIS_HOST,
        port: Number(config.REDIS_PORT),
      },
      username: config.REDIS_USERNAME,
      password: config.REDIS_PASSWORD,
    });

    redisClient.on("error", (err) => {
      console.error("❌ Redis Error:", err);
    });

    redisClient.on("connect", () => {
      console.log("🔄 Connecting to Redis...");
    });

    redisClient.on("ready", () => {
      console.log("✅ Redis Connected Successfully");
    });

    redisClient.on("reconnecting", () => {
      console.log("♻️ Reconnecting to Redis...");
    });

    redisClient.on("end", () => {
      console.log("❌ Redis Connection Closed");
    });

    await redisClient.connect();

    return redisClient;
  } catch (error) {
    console.error("❌ Redis Connection Failed:", error.message);
    return null;
  }
};

/**
 * Generate 6 Digit OTP
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Store OTP for 10 Minutes
 */
export const storeOTP = async (email, otp) => {
  try {
    if (!redisClient) {
      console.log("⚠️ Redis not connected");
      return false;
    }

    await redisClient.setEx(
      `otp:${email}`,
      600,
      otp
    );

    return true;
  } catch (error) {
    console.error(
      "❌ Error Storing OTP:",
      error.message
    );
    return false;
  }
};

/**
 * Verify OTP
 */
export const verifyOTP = async (email, otp) => {
  try {
    if (!redisClient) {
      console.log("⚠️ Redis not connected");
      return false;
    }

    const storedOTP = await redisClient.get(
      `otp:${email}`
    );

    if (storedOTP === otp) {
      await redisClient.del(`otp:${email}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(
      "❌ Error Verifying OTP:",
      error.message
    );
    return false;
  }
};

/**
 * Delete OTP Manually
 */
export const deleteOTP = async (email) => {
  try {
    if (!redisClient) return false;

    await redisClient.del(`otp:${email}`);
    return true;
  } catch (error) {
    console.error(
      "❌ Error Deleting OTP:",
      error.message
    );
    return false;
  }
};

/**
 * Get Redis Client
 */
export const getRedisClient = () => redisClient;

export default {
  initRedis,
  generateOTP,
  storeOTP,
  verifyOTP,
  deleteOTP,
  getRedisClient,
};