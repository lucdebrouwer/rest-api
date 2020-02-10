const express = require("express");
const morgan = require("morgan");
const bcrypt = require("bcryptjs");
const auth = require("basic-auth");
const cors = require("cors");
const modules = {
  express,
  morgan,
  bcrypt,
  auth,
  cors
};

module.exports = modules;
