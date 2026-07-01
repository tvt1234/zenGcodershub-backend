
import Assignment from "../models/Assignment.js";


export const createAssignment = async (req, res) => {

  const data = await Assignment.create(req.body);
  res.json(data);
};

export const getAssignments = async (req, res) => {
  const data = await Assignment.find().populate("students");
  res.json(data);
};

export const updateAssignment = async (req, res) => {
  const data = await Assignment.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(data);
};

export const deleteAssignment = async (req, res) => {
  await Assignment.findByIdAndDelete(req.params.id);
  res.json({ message: "deleted" });
};


// student looking for assignments 
export const getStudentAssignments = async (req, res) => {
  try {
    const { id } = req.params;

    const assignments = await Assignment.find({
      $or: [
        { isAll: true },
        { students: { $in: [id] } }  // 🔥 FIXED
      ]
    }).populate("students", "name email");

    res.json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message
    });
  }
};