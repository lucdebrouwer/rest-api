"use strict";

// load modules
const express = require("express");
const morgan = require("morgan");
const { sequelize } = require("./db");

const routes = require("./routes");

// variable to enable global error logging
const enableGlobalErrorLogging =
  process.env.ENABLE_GLOBAL_ERROR_LOGGING === "true";

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan("dev"));

// TODO setup your api routes here
app.use("/api", routes.course);
app.use("/api", routes.user);

// setup a friendly greeting for the root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the REST API project!"
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found"
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {}
  });
});

// set our port
app.set("port", process.env.PORT || 5000);

// Test Database connection
sequelize
  .authenticate()
  .then(() => {
    console.log("[CONNECTION] Connection has been established successfully.");
  })
  .catch(err => {
    console.error("[CONNECTION] Unable to connect to the database:", err);
  });

// Sync our database
// start listening on our port
sequelize
  .sync({
    force: true,
    logging: console.log("[SEQUELIZE] START SYNCING DATABASE ")
  })
  .then(() => {
    app.listen(app.get("port"), () => {
      console.log(`[SEQUELIZE] FINISHED SYNCING `);
      console.log(
        `[SERVER] Express server is listening on port ${app.get("port")}`
      );
    });
  });
