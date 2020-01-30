const asyncHandler = require("./asyncHandler");
const authenticateUser = require("./authenticateUser");
const handleSequelizeValidationError = require("./handleSequelizeValError");
const handlers = {
  asyncHandler,
  authenticateUser,
  handleSequelizeValidationError
};

module.exports = handlers;
