const validateParams = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params);
    if (error) {
      return res.status(400).json({ message: "Invalid params", details: error.details });
    }
    next();
  };
};

module.exports = validateParams;
