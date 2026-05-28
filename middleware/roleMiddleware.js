export const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // req.user comes from auth middleware (JWT)
      if (!req.user) {
        return res.status(401).json({
          msg: "Unauthorized - No user found",
        });
      }

      const userRole = req.user.role;

      // check if role is allowed
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          msg: "Access denied - You do not have permission",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        msg: "Role validation error",
        error: error.message,
      });
    }
  };
};