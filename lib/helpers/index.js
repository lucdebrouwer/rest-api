const syncServer = require("./syncServer");
const testAuth = require("./testAuthentication");
const routeNotFound = require("./routeNotFound");
const globalErrorHandler = require("./errorHandler");
const doServerSetup = require("./doServerSetup");
const helpers = {
  syncServer,
  testAuth,
  routeNotFound,
  globalErrorHandler,
  doServerSetup
};

module.exports = helpers;
