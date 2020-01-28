/* ----------- IMPORTING ------------- */
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const db = require("../db");

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
  // Create user object to store our data in
  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    emailAddress: req.body.emailAddress,
    password: bcrypt.hashSync(req.body.password)
  };

  // When registering a new user, we want to know if that user already exists.
  // Check if the email already exists, if not fill the remaining data for that particular email adddress.
  // Else provide an error message.
  await db.models.User.findOrCreate({
    where: { emailAddress: user.emailAddress },
    defaults: {
      firstName: user.firstName,
      lastName: user.lastName,
      password: bcrypt.hashSync(user.password) // Encrypt the user's password using the bcrypt library
    }
  })
    .then(([user, created]) => {
      console.log("[USER CREATION] Entering User Creation");
      if (created) {
        console.log(
          "[REGISTER] Succesfully created account for: ",
          user.emailAddress
        );
        res.status(201).end();
      } else {
        console.log(
          "[USER CREATION - [EXCEPTION]] Email is already in use",
          user.emailAddress
        );
        res.send("Please try an unique email address");
        res.status(400).end();
      }
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
});

module.exports = router;
