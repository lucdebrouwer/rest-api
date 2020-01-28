module.exports = function globalErrorHandler(app, errorHandleEnabled) {
  app.use((err, req, res, next) => {
    if (errorHandleEnabled) {
      console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
    }

    res.status(err.status || 500).json({
      message: err.message,
      error: {}
    });
  });
};
