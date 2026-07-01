
// import Student from "../models/Student.js";
// import Teacher from "../models/Teacher.js";
// import Course from "../models/Course.js";

// export const getDashboardStats = async (req, res) => {
//   try {
//     const totalStudents = await Student.countDocuments();
//     const totalTeachers = await Teacher.countDocuments();
//     const totalCourses = await Course.countDocuments();

//     res.status(200).json({
//       success: true,
//       data: {
//         totalStudents,
//         totalTeachers,
//         totalCourses,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };