import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import Payment from "../models/Payment.js";

/**
 * 🎓 ENROLL IN COURSE
 */
export const enrollCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.body;

    // check course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    // prevent duplicate enrollment
    const existing = await Enrollment.findOne({
      user: userId,
      course: courseId,
    });

    if (existing) {
      return res.status(400).json({
        msg: "Already enrolled in this course",
      });
    }

    const enrollment = await Enrollment.create({
      user: userId,
      course: courseId,
    });

    res.status(201).json({
      msg: "Enrolled successfully",
      enrollment,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error enrolling course",
      error: error.message,
    });
  }
};

/**
 * 📚 GET MY ENROLLMENTS (Student Dashboard)
 */
export const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      user: req.user.id,
    })
      .populate("course")
      .sort({ createdAt: -1 });

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({
      msg: "Error fetching enrollments",
      error: error.message,
    });
  }
};

/**
 * 📊 UPDATE PROGRESS (Teacher/System)
 */
export const updateProgress = async (req, res) => {
  try {
    const { enrollmentId, progress } = req.body;

    const enrollment = await Enrollment.findById(enrollmentId);

    if (!enrollment) {
      return res.status(404).json({
        msg: "Enrollment not found",
      });
    }

    enrollment.progress = progress;

    // auto mark completed
    if (progress === 100) {
      enrollment.status = "completed";
    }

    await enrollment.save();

    res.json({
      msg: "Progress updated",
      enrollment,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error updating progress",
      error: error.message,
    });
  }
};

/**
 * 🗑️ UNENROLL COURSE
 */
export const unenrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    await Enrollment.findOneAndDelete({
      user: req.user.id,
      course: courseId,
    });

    res.json({
      msg: "Unenrolled successfully",
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error unenrolling course",
      error: error.message,
    });
  }
};




export const checkEnrollment = async (req, res) => {
  try {
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: courseId,
      paymentStatus: "paid",
      status: "enrolled",
    });

    if (!enrollment) {
      return res.json({ access: false });
    }

    res.json({ access: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};