const errorHandler = (err, req, res, next) => {
  // If the route already sent a response, just delegate
  if (res.headersSent) {
    return next(err);
  }

  // Custom status code if set, else default to 500
  const statusCode = err.statusCode || err.status || 500;

  // Generic message for 500 in production, specific message otherwise
  const isProd = process.env.NODE_ENV === "production";
  const message =
    statusCode === 500 && isProd
      ? "Internal server error"
      : err.message || "Something went wrong";

  // Optional: Log error (you can make this fancier later)
  console.error("Error handler caught:", {
    message: err.message,
    stack: err.stack,
  });

  // Send JSON response
  res.status(statusCode).json({
    success: false,
    message,
    // Only expose stack trace outside production
    ...(isProd ? {} : { stack: err.stack }),
  });
};

module.exports = errorHandler;
