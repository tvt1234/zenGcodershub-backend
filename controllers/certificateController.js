import Certificate from "../models/Certificate.js";
import User from "../models/User.js";
import Course from "../models/Course.js";
import crypto from "crypto";

/**
 * 🎓 Generate Certificate
 * Called after course completion
 */
export const generateCertificate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.body;

    // Check user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    // Check if certificate already exists
    const existing = await Certificate.findOne({
      user: userId,
      course: courseId,
    });

    if (existing) {
      return res.status(400).json({
        msg: "Certificate already generated for this course",
        certificate: existing,
      });
    }

    // Generate unique certificate ID
    const certificateId = crypto.randomBytes(10).toString("hex");

    // Create certificate
    const certificate = await Certificate.create({
      certificateId,
      user: userId,
      course: courseId,
      userName: user.name,
      courseName: course.title,
      issueDate: new Date(),
    });

    res.status(201).json({
      msg: "Certificate generated successfully",
      certificate,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Server error while generating certificate",
      error: error.message,
    });
  }
};

/**
 * 📄 Get all certificates of logged-in user
 */
export const getUserCertificates = async (req, res) => {
  try {
    const userId = req.user.id;

    const certificates = await Certificate.find({ user: userId })
      .populate("course", "title fee")
      .sort({ issueDate: -1 });

    res.json(certificates);
  } catch (error) {
    res.status(500).json({
      msg: "Error fetching certificates",
      error: error.message,
    });
  }
};

/**
 * 🔍 Verify Certificate (Public API)
 * Used for certificate validation page
 */
export const verifyCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;

    const certificate = await Certificate.findOne({ certificateId })
      .populate("user", "name email")
      .populate("course", "title");

    if (!certificate) {
      return res.status(404).json({
        valid: false,
        msg: "Invalid certificate",
      });
    }

    res.json({
      valid: true,
      certificate,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error verifying certificate",
      error: error.message,
    });
  }
};