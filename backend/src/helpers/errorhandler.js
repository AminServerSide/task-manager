// error handler middleware
const errorHandler = (err, req, res, next) => {
  // check if response headers have already been sent to the client
  if (res.headersSent) {
    // if true, pass the error to the next error-handling middleware
    return next(err);
  }

  // set the status code of the response
  const statusCode = res.statusCode && res.statusCode >= 400 ? res.statusCode : 500;
  res.status(statusCode); // set the status code of the response

  // log error stack trace to the console if not in production --> for debugging
  if (process.env.NODE_ENV !== "production") {
    console.log(err);
  }

  // Custom error handling for specific errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation Error",
      details: err.errors,
    });
  } else if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid data format",
      details: err.message,
    });
  }

  // Send general error response
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export default errorHandler;
