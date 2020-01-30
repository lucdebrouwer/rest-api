const asyncHandler = require("./asyncHandler");
const authenticateUser = require("./authenticateUser");
const handleSequelizeValidationError = require("./handleSequelizeValError");
const handleEmptyBody = require("./handleEmptyBody");

const handlers = {
  asyncHandler,
  authenticateUser,
  handleSequelizeValidationError,
  handleEmptyBody
};

module.exports = handlers;
