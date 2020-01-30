const { express } = require("../modules");
const {
  asyncHandler,
  authenticateUser,
  handleSequelizeValidationError,
  handleEmptyBody
} = require("../lib/handlers");
const models = require("../models");
const router = express.Router();
router.use(express.urlencoded());
router.use(express.json());

// GET /api/courses 200 - Returns a list of courses (including the user that owns each course)
router.get(
  "/courses",
  asyncHandler(async (req, res) => {
    await models.Course.findAll({
      include: [
        {
          model: models.User,
          attributes: ["id", "firstName", "lastName", "emailAddress"]
        }
      ]
    })
      .then(course => {
        console.log("[COURSE | GET ] Retrieving Courses");
        if (course.length > 0) {
          res
            .status(200)
            .json(course)
            .end();
        } else {
          res
            .status(404)
            .json({
              message: "No courses were found"
            })
            .end();
        }
      })
      .catch(err => console.log(err));
  })
);
// GET /api/courses/:id 200 - Returns a the course (including the user that owns the course) for the provided course ID
router.get(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    await models.Course.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: models.User,
          attributes: ["id", "firstName", "lastName", "emailAddress"]
        }
      ]
    }).then(course => {
      if (course) {
        console.log(
          `[COURSE | GET] Retrieving Course with ID: ${req.params.id} and Title: ${course.title}`
        );
        res
          .status(200)
          .json(course)
          .end();
      } else {
        res
          .status(404)
          .json({
            error: `The course with id ${req.params.id} you are trying to retrieve does not exist`
          })
          .end();
      }
    });
  })
);

// POST /api/courses 201 - Creates a course, sets the Location header to the URI for the course, and returns no content
router.post(
  "/courses",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req.currentUser;
    if (user && user.emailAddress !== null) {
      console.log(
        "[COURSE | CREATE] Start creating course for user ",
        user.emailAddress
      );
      await models.Course.create({
        title: req.body.title,
        description: req.body.description,
        estimatedTime: req.body.estimatedTime,
        materialsNeeded: req.body.materialsNeeded,
        UserId: user.id
      })
        .then(course => {
          if (course) {
            console.log(
              `[COURSE | CREATE] Succesfully created course ${course.title}`
            );
            res.setHeader("Location", `/courses/${course.id}`);
            res.status(201).end();
          }
        })
        .catch(error => {
          handleSequelizeValidationError(req, res, next, error);
        });
    } else {
      console.log(
        "[AUTHORIZATION] Failed authorization, no user on the header"
      );
    }
  })
);

// PUT /api/courses/:id 204 - Updates a course and returns no content
router.put(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res, next) => {
    const user = req.currentUser;

    // Validation Steps:
    // 1. Check if the request contains data else throw exception
    // 2. If data is present, check if the requested course does exist, else throw an exception
    // 2.1 Check if the requested course belongs to the authenticatedUser
    // 2.2 If user doesn't own the course, throw an exception

    // As I had no idea how to check for object length I had to google.
    // the check comes from: https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
    if (
      Object.entries(req.body).length === 0 &&
      req.body.constructor === Object
    ) {
      handleEmptyBody(res);
    } else {
      await models.Course.findOne({
        where: { id: req.params.id },
        include: {
          model: models.User
        }
      })
        .then(course => {
          if (!course) {
            res
              .status(404)
              .json({
                error: "The requested course could not be found"
              })
              .end();
          } else {
            if (user.id === course.User.id) {
              models.Course.update(req.body, {
                where: {
                  id: req.params.id
                }
              })
                .then(() => {
                  res.status(204).end();
                })
                .catch(error => {
                  handleSequelizeValidationError(req, res, next, error);
                });
            } else {
              res
                .status(403)
                .json({
                  error:
                    "You do not own the course, please try a different course"
                })
                .end();
            }
          }
        })
        .catch(error => {
          next(error);
        });
    }
  })
);
// DELETE /api/courses/:id 204 - Deletes a course and returns no content
router.delete(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    // Validation Steps:
    // 1. Check if the requested course exists
    // 2. If the course exists else throw an exception
    // 2.1 Check if the requested course belongs to the authenticatedUser
    // 2.2 If user doesn't own the course, throw an exception
    const user = req.currentUser;

    await models.Course.findOne({
      where: { id: req.params.id },
      include: {
        model: models.User,
        attributes: ["id"]
      }
    }).then(course => {
      if (!course) {
        res
          .status(404)
          .json({
            error: "Course could not be found"
          })
          .end();
      } else {
        if (user.id === course.User.id) {
          models.Course.destroy({
            where: {
              id: req.params.id
            }
          })
            .then(isCourseDeleted => {
              // isCourseDeleted returns either 0 or 1
              if (!isCourseDeleted) {
                res.status(500).end();
              } else {
                res.status(204).end();
              }
            })
            .catch(error => {
              next(error);
              console.log(error);
            });
        } else {
          res
            .status(403)
            .json({
              error: "You do not own this course, please try a different course"
            })
            .end();
        }
      }
    });
  })
);

module.exports = router;
