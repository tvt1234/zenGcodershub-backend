
import Course from "../models/Course.js";

/**
 * CREATE COURSE
 */
export const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      originalPrice,
      salePrice,
      image,
    } = req.body;

    const course = await Course.create({
      title,
      description,
      originalPrice,
      salePrice,
      image,
      createdBy: req.user.id,
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
 * GET ALL COURSES
 */
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({
      msg: "Error fetching courses",
      error: error.message,
    });
  }
};

/**
 * GET SINGLE COURSE
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

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({
      msg: "Error fetching course",
      error: error.message,
    });
  }
};

/**
 * UPDATE COURSE
 */
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        msg: "Course not found",
      });
    }

    if (
      course.createdBy?.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        msg: "Not authorized to update this course",
      });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      msg: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error updating course",
      error: error.message,
    });
  }
};

/**
 * DELETE COURSE
 */
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        msg: "Course not found",
      });
    }

    if (
      course.createdBy?.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        msg: "Not authorized to delete this course",
      });
    }

    await course.deleteOne();

    res.status(200).json({
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
 * GET TEACHER COURSES
 */
export const getCoursesByTeacher = async (req, res) => {
  try {
    const courses = await Course.find({
      createdBy: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({
      msg: "Error fetching teacher courses",
      error: error.message,
    });
  }
};

