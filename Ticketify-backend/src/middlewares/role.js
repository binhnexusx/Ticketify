const checkRole = (roleRequired) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== roleRequired) {
      return res
        .status(403)
        .json({ message: "Forbidden - not enough permission" });
    }
    next();
  };
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Access denied: Admins only" });
  }
  next();
};

module.exports = { checkRole, adminOnly };
