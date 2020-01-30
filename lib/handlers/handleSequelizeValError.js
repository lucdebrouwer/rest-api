module.exports = function handleSequelizeValidationError(
  req,
  res,
  next,
  error
) {
  if (error) {
    // Check for Validation Errors
    if (error.name === "SequelizeValidationError") {
      const errors = error.errors.map(err => {
        let errObj = {
          type: err.type,
          message: err.message
        };
        return errObj;
      });
      res
        .status(400)
        .json({ errors })
        .end();
    } else {
      // If there is a different error, pass it to our global error handler
      next(error);
    }
  }
};
