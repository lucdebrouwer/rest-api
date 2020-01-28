const express = require("express");
const router = express.Router();
const models = require("../models");
// Set up the following routes (listed in the format HTTP METHOD Route HTTP Status Code):
// GET /api/courses 200 - Returns a list of courses (including the user that owns each course)
// GET /api/courses/:id 200 - Returns a the course (including the user that owns the course) for the provided course ID
// POST /api/courses 201 - Creates a course, sets the Location header to the URI for the course, and returns no content
// PUT /api/courses/:id 204 - Updates a course and returns no content
// DELETE /api/courses/:id 204 - Deletes a course and returns no content

router.get("/courses", async (req, res) => {
  await models.User.findAll({
    include: [
      {
        model: models.Course
      }
    ]
  })
    .then(user => {
      console.log("[COURSES] Retrieving Courses");
      res.send(user);
      res.status(200).end();
    })
    .catch(err => console.log(err));
});
router.get("/courses/:id", (req, res) => {
  res.status(200).end();
});
router.post("/courses", (req, res) => {
  res.status(201).end();
});
router.put("/courses/:id", (req, res) => {
  res.status(204).end();
});
router.delete("/courses/:id", (req, res) => {
  res.status(204).end();
});

module.exports = router;
