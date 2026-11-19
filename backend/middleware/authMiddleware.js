const jwt = require("jsonwebtoken");

// Checks the "Authorization: Bearer <token>" header and puts the user on req.user
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "Please log in to continue." });

  const token = authHeader.split(" ")[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    // 401 tells the frontend to send the user back to the login page
    res.status(401).json({ error: "Your session has expired. Please log in again." });
  }
};

// Use after authMiddleware on routes only admins may call
const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Only admins can do this." });
  }
  next();
};

module.exports = authMiddleware;
module.exports.requireAdmin = requireAdmin;
