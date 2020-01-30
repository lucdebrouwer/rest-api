const syncServer = require("./syncServer");
const testAuth = require("./testAuthentication");
const routeNotFound = require("./routeNotFound");
const globalErrorHandler = require("./errorHandler");
const doServerSetup = require("./doServerSetup");
const checkProperties = require("./checkProperties");
const helpers = {
  syncServer,
  testAuth,
  routeNotFound,
  globalErrorHandler,
  doServerSetup,
  checkProperties
};

module.exports = helpers;
