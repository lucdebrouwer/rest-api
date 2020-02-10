"use strict";

/* ----------- LOAD HELPERS & MODULES ------------- */
const { express, morgan, cors } = require("./modules");
const {
  testAuth,
  syncServer,
  routeNotFound,
  globalErrorHandler,
  doServerSetup
} = require("./lib/helpers");

/* ----------- LOAD APPLICATION STRUCTURE ------------- */
const models = require("./models");
const routes = require("./routes");

/* ------------ SERVER SETUP ------------ */
const app = doServerSetup(express, morgan, routes, cors);

/* ---------- ERROR HANDLING ---------- */
routeNotFound(app);
// variable to enable global error logging
const enableGlobalErrorLogging =
  process.env.ENABLE_GLOBAL_ERROR_LOGGING === "true";

globalErrorHandler(app, enableGlobalErrorLogging);

/* ---------- SERVER INITIALIZATION ---------- */
testAuth(models); //Test Database connection
syncServer(models, app); // Sync models & start server
