const express = require("express");
const morgan = require("morgan");
const bcrypt = require("bcryptjs");
const auth = require("basic-auth");

const modules = {
  express,
  morgan,
  bcrypt,
  auth
};

module.exports = modules;
