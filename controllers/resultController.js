
import Result from "../models/Result.js";




// CREATE RESULT
export const createResult = async (req, res) => {
  try {
    const { student, subject, examType, marksObtained, totalMarks } = req.body;

    let percentage = (marksObtained / totalMarks) * 100;

    let grade = "";
    if (percentage >= 90) grade = "A+";
    else if (percentage >= 75) grade = "A";
    else if (percentage >= 60) grade = "B";
    else if (percentage >= 40) grade = "C";
    else grade = "F";

    const resultStatus = percentage >= 40 ? "Pass" : "Fail";

    const result = await Result.create({
      student,
      subject,
      examType,
      marksObtained,
      totalMarks,
      percentage,
      grade,
      resultStatus,
      teacher: req.user._id,
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL (TEACHER DASHBOARD)
export const getTeacherResults = async (req, res) => {
  try {
    const results = await Result.find({ teacher: req.user._id })
      .populate("student")
      .sort({ createdAt: -1 });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE RESULT
export const getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id).populate("student");
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE RESULT
export const updateResult = async (req, res) => {
  try {
    const { marksObtained, totalMarks } = req.body;

    let percentage = (marksObtained / totalMarks) * 100;

    let grade = "";
    if (percentage >= 90) grade = "A+";
    else if (percentage >= 75) grade = "A";
    else if (percentage >= 60) grade = "B";
    else if (percentage >= 40) grade = "C";
    else grade = "F";

    const resultStatus = percentage >= 40 ? "Pass" : "Fail";

    const updated = await Result.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        percentage,
        grade,
        resultStatus,
      },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE RESULT
export const deleteResult = async (req, res) => {
  try {
    await Result.findByIdAndDelete(req.params.id);
    res.json({ message: "Result deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// looking for student in  results in id 
export const getMyResults = async (req, res) => {
  try {
    console.log("HEADERS:", req.headers);

    console.log("USER:", req.user); // 🔥 MUST CHECK THIS

    const studentId = req.user.id;

    const results = await Result.find({ student: studentId });

    return res.json(results);
  } catch (err) {
    console.log("ERROR:", err); // 🔥 VERY IMPORTANT
    res.status(500).json({ message: err.message });
  }
};