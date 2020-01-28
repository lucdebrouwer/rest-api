const express = require("express");
const router = express.Router();
const models = require("../models");
const { asyncHandler } = require("../lib/handlers");

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
          model: models.User
        }
      ]
    })
      .then(course => {
        console.log("[COURSES] Retrieving Courses");
        res.send(course);
        res.status(200).end();
      })
      .catch(err => console.log(err));
  })
);

router.get(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    console.log("[ID] ID is: ", req.params.id);
    await models.Course.findOne({
      where: { id: req.params.id },
      include: [{ model: models.User }]
    }).then(course => {
      console.log(
        `[COURSES] Retrieving Course with ID: ${req.params.id} and Title: ${course.title}`
      );
      res.send(course);
      res.status(200).end();
    });
  })
);
router.post(
  "/courses",
  asyncHandler(async (req, res) => {
    res.status(201).end();
  })
);
router.put(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    res.status(204).end();
  })
);

router.delete(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    res.status(204).end();
  })
);

module.exports = router;
