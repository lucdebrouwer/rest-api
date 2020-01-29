const asyncHandler = require("./asyncHandler");
const authenticateUser = require("./authenticateUser");
const handlers = {
  asyncHandler,
  authenticateUser
};

module.exports = handlers;
