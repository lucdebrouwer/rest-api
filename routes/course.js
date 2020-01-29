const { express } = require("../modules");
const { asyncHandler, authenticateUser } = require("../lib/handlers");
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
//TODO: Set location header to /
router.post(
  "/courses",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req.currentUser;
    if (user) {
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
      }).then(course => {
        console.log(
          `[COURSE | CREATE] Succesfully created course ${course.title}`
        );
        res.setHeader("Location", "/");
        res.status(201).end();
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
    await models.Course.findOne({
      where: { id: req.params.id },
      include: {
        model: models.User
      }
    })
      .then(course => {
        if (course) {
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
                next(error);
              });
          } else {
            res.json({
              error: "Access Denied, you don't own this course"
            });
            res.status(403).end();
          }
        } else {
          res.json({
            error: "Course Not Found"
          });
          res.status(404).end();
        }
      })
      .catch(error => {
        next(error);
      });
  })
);
// DELETE /api/courses/:id 204 - Deletes a course and returns no content
router.delete(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req.currentUser;
    await models.Course.findOne({
      where: { id: req.params.id },
      include: {
        model: models.User
      }
    })
      .then(course => {
        if (course) {
          if (user.id === course.User.id) {
            console.log(
              `[COURSE | DELETE] Deleting course with ID: ${req.params.id}`
            );
            models.Course.destroy({
              where: {
                id: req.params.id
              }
            })
              .then(courseDeleted => {
                if (courseDeleted === 1) {
                  console.log(
                    "[COURSE | DELETE] Succesfully deleted course with id ",
                    req.params.id
                  );
                  res.status(204).end();
                } else {
                  res.status(500).end();
                }
              })
              .catch(error => {
                console.log(error);
                next(error);
              });
          } else {
            res
              .status(403)
              .json({
                error: "Access Denied, you don't own this course"
              })
              .end();
          }
        } else {
          res
            .status(404)
            .json({
              error: "Course Not Found"
            })
            .end();
        }
      })
      .catch(error => {
        next(error);
      });
  })
);

module.exports = router;
