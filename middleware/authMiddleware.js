import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  try {
    // 🔐 Get token from header
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ msg: "No token provided" });
    }

    // 🧹 Handle "Bearer <token>"
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    // 🔍 Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");

    // 🧑 Attach user to request
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      msg: "Invalid or expired token",
    });
  }
};