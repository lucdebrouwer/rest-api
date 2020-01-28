/* ----------- IMPORTING ------------- */
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const models = require("../models");
const Sequelize = models.Sequelize;
/* ---------- SETUP ------------- */
router.use(express.urlencoded());
router.use(express.json());

/* ------------ ROUTES & LOGIC ------------ */

// TODO: Implement authentication middleware
// TODO: Return the current authenticated user

/**
 * @description Returns the currently authenticated user
 * @returns 200 || 403 if not authorized
 * @method GET
 */
router.get("/users", (req, res) => {
  res.send("Hello from the User side");
  res.status(200).end();
});

/**
 * @description Creates a user, sets the Location header to "/", and returns no content
 * @returns 201 || 400 if not succesful
 * @method POST
 */
router.post("/users", async (req, res, next) => {
  // When registering a new user, we want to know if that user already exists.
  // Check if the email already exists, if not fill the remaining data for that particular email adddress.
  // Else provide an error message.
  const doesUserExist = await models.User.findOne({
    where: { emailAddress: req.body.emailAddress }
  });

  if (doesUserExist) {
    console.log([`[USER] ${req.body.emailAddress} already exists"`]);
    res.json({
      message: `USER: ${req.body.emailAddress} already exists, perhaps try logging in? `
    });
  } else {
    console.log(
      `[USER]${req.body.emailAddress} does not exist, starting creation process`
    );
    if (req.body.password !== "" && req.body.password !== null) {
      await models.User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailAddress: req.body.emailAddress,
        password: bcrypt.hashSync(req.body.password)
      })
        .then(user => {
          console.log(
            "[USER CREATION] Entering User Creation for user",
            req.body.emailAddress
          );
          if (user) {
            console.log(
              "[REGISTER] Succesfully created account for: ",
              user.emailAddress
            );
            res.status(201).end();
          } else {
            console.log(
              "[REGISTER] Failed to create account for: ",
              user.emailAddress
            );
          }
        })
        .catch(function(err) {
          if (err) {
            console.log(err);
            const errors = err.errors.map(error => error.message);
            res.json({ error: errors });
            res.status(500).end();
          }
        });
    } else {
      console.log("[ERROR] No password was provided");
      res.json({
        error: "No password was provided"
      });
      res.status(401).end();
    }
  }
});

module.exports = router;
