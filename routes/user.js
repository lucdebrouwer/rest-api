/* ----------- IMPORTING ------------- */
const { express, bcrypt } = require("../modules");
const {
  asyncHandler,
  authenticateUser,
  handleSequelizeValidationError,
  handleEmptyBody
} = require("../lib/handlers");
//const { checkProperties } = require("../lib/helpers"); TODO: Replace array logic into checkProperties func.
const router = express.Router();

const models = require("../models");

/* ---------- SETUP ------------- */
router.use(express.urlencoded());
router.use(express.json());

/* ------------ ROUTES & LOGIC ------------ */

/**
 * @description Returns the currently authenticated user
 * @returns 200 || 401 if not authorized
 * @method GET
 */
router.get(
  "/users",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req.currentUser;
    res
      .status(200)
      .json({
        user
      })
      .end();
  })
);

/**
 * @description Creates a user, sets the Location header to "/", and returns no content
 * @returns 201 || 400 if not succesful
 * @method POST
 */

router.post("/users", async (req, res, next) => {
  // When registering a new user, we want to know if that user already exists.
  // Check if the email already exists, if not fill the remaining data for that particular email adddress.
  // Else provide an error message.

  // Check if request body exists and is not an empty object
  if (
    Object.entries(req.body).length === 0 &&
    req.body.constructor === Object
  ) {
    res
      .status(400)
      .json({
        error: {
          type: "notEmpty violation",
          message: "Request object can not be empty"
        }
      })
      .end();
  } else {
    // Checks if the request body has all the properties in place
    if (handleEmptyBody(req, res)) {
      // In order to make sure you can't spoof the creation process,
      // I've created an array that will be filled with properties that are not null or empty
      // if the length of the array === 4 then it means all the properties have a value
      // if < 4 that mean someone forgot to put in a value and we don't want that to happen.
      let myArr = [];

      // Save our request object into a new object so we can access its key:value pair.
      // Doing it on the req.obj gives undesirable result
      let obj = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailAddress: req.body.emailAddress,
        password: req.body.password
      };

      // Loop over each property, check for null and empty
      // if either condition is false, push that prop to the array
      for (key in obj) {
        if (obj[key].length === 0 || obj[key] === "") {
          // DO NOTHING
        } else {
          myArr.push(obj[key]);
        }
      }
      // as mentioned above, if length === 4 this means every value is in place.
      if (myArr.length === 4) {
        await models.User.findOrCreate({
          where: {
            emailAddress: req.body.emailAddress
          },
          defaults: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: bcrypt.hashSync(req.body.password)
          }
        })
          .then(([user, created]) => {
            const usr = user.get({ plain: true });
            if (created) {
              res.setHeader("Location", "/");
              res.status(201).end();
            } else {
              res
                .status(400)
                .json({
                  error: {
                    type: "unique constraint violation",
                    message: `User ${usr.emailAddress} already exists, try to login instead?`
                  }
                })
                .end();
            }
          })
          .catch(error => {
            // Pass any errors to our sequelizeValidationError handler.
            handleSequelizeValidationError(req, res, next, error);
          });
      } else {
        res.status(400).json({
          error: {
            type: "notNull violation",
            message: "Missing values for one or more properties"
          }
        });
      }
    } else {
      // One or more properties are missing on the request body
      res.status(400).json({
        error: {
          type: "notNull violation",
          message:
            "Request object is missing one or more properties on the req object"
        }
      });
    }
  }
});

module.exports = router;
