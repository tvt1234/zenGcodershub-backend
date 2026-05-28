import Course from "../models/Course.js";

/**
 * 📚 CREATE COURSE (Teacher / Admin)
 */
export const createCourse = async (req, res) => {
  try {
    const { title, description, fee, image } = req.body;

    const course = await Course.create({
      title,
      description,
      fee,
      image,
      createdBy: req.user.id, // from JWT middleware
    });

    res.status(201).json({
      msg: "Course created successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error creating course",
      error: error.message,
    });
  }
};

/**
 * 📖 GET ALL COURSES (Public)
 */
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (error) {
    res.status(500).json({
      msg: "Error fetching courses",
      error: error.message,
    });
  }
};

/**
 * 📄 GET SINGLE COURSE
 */
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("createdBy", "name role");

    if (!course) {
      return res.status(404).json({
        msg: "Course not found",
      });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({
      msg: "Error fetching course",
      error: error.message,
    });
  }
};

/**
 * ✏️ UPDATE COURSE (Only owner or admin)
 */
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        msg: "Course not found",
      });
    }

    // Only creator or admin can update
    if (
      course.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        msg: "Not authorized to update this course",
      });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      msg: "Course updated successfully",
      updatedCourse,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error updating course",
      error: error.message,
    });
  }
};

/**
 * 🗑️ DELETE COURSE
 */
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        msg: "Course not found",
      });
    }

    // Only creator or admin can delete
    if (
      course.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        msg: "Not authorized to delete this course",
      });
    }

    await course.deleteOne();

    res.json({
      msg: "Course deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error deleting course",
      error: error.message,
    });
  }
};

/**
 * 👨‍🏫 GET COURSES BY TEACHER
 */
export const getCoursesByTeacher = async (req, res) => {
  try {
    const courses = await Course.find({
      createdBy: req.user.id,
    });

    res.json(courses);
  } catch (error) {
    res.status(500).json({
      msg: "Error fetching teacher courses",
      error: error.message,
    });
  }
};