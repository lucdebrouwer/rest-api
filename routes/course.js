const { express } = require("../modules");
const { asyncHandler, authenticateUser } = require("../lib/handlers");
const models = require("../models");
const router = express.Router();
router.use(express.urlencoded());
router.use(express.json());
// Set up the following routes (listed in the format HTTP METHOD Route HTTP Status Code):
// GET /api/courses 200 - Returns a list of courses (including the user that owns each course)
// GET /api/courses/:id 200 - Returns a the course (including the user that owns the course) for the provided course ID
// POST /api/courses 201 - Creates a course, sets the Location header to the URI for the course, and returns no content
// PUT /api/courses/:id 204 - Updates a course and returns no content
// DELETE /api/courses/:id 204 - Deletes a course and returns no content

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
          res.send(course);
        } else {
          res.send({
            message: "No courses were found"
          });
        }
        res.status(200).end();
      })
      .catch(err => console.log(err));
  })
);

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
        res.json(course);
        res.status(200).end();
      } else {
        res.json({
          error: `The course with id ${req.params.id} you are trying to retrieve does not exist`
        });
      }
    });
  })
);

// TODO: Implement User Authentication to access the userId property in order to create courses.
// TODO: Implement Create Course route.

router.post(
  "/courses",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req.currentUser;
    console.log("COURSE BODY ", req.body);
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
        res.status(201).end();
      });
    } else {
      console.log(
        "[AUTHORIZATION] Failed authorization, no user on the header"
      );
    }
  })
);

router.put(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    res.status(204).end();
  })
);

router.delete(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    console.log(`[COURSE | DELETE] Deleting course with ID: ${req.params.id}`);
    await models.Course.destroy({
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
          res.status(400).end();
        }
      })
      .catch(err => {
        console.log(err);
      });
  })
);

module.exports = router;
