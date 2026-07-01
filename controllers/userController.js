
import User from "../models/User.js";

// 👤 SELF PROFILE UPDATE (teacher/student)
export const updateMyProfile = async (req, res) => {
  console.log("BODY =", req.body);
console.log("USER =", req.user);
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      mobile: req.body.mobile,
      profile: req.body.profile,
    },
    { new: true }
  );

  res.json(user);
};

// 👨‍💼 ADMIN CAN UPDATE ANY USER
export const adminUpdateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(user);
};




export const getStudents = async (req, res) => {
  console.log("🔥 GET STUDENTS HIT");

  const students = await User.find({ role: "student" });

  console.log("FOUND:", students);

  res.json(students);
};


export const searchStudents = async (req, res) => {
  const { name } = req.query;

  const data = await User.find({
    role: "student",
    name: { $regex: name, $options: "i" },
  });

  res.json(data);
};