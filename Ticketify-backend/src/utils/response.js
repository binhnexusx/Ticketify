const success = (res, data = null, message = "Success", status = 200) => {
  return res.status(status).json({
    status: "success",
    message,
    data,
  });
};

const sendError = (
  res,
  statusCode = 500,
  message = "Something went wrong",
  errors = null
) => {
  return res.status(statusCode).json({
    status: "error",
    message,
    ...(errors && { errors }),
  });
};

module.exports = {
  success,
  sendError,
};
