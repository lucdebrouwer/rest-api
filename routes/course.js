const express = require("express");
const router = express.Router();

// Set up the following routes (listed in the format HTTP METHOD Route HTTP Status Code):
// GET /api/courses 200 - Returns a list of courses (including the user that owns each course)
// GET /api/courses/:id 200 - Returns a the course (including the user that owns the course) for the provided course ID
// POST /api/courses 201 - Creates a course, sets the Location header to the URI for the course, and returns no content
// PUT /api/courses/:id 204 - Updates a course and returns no content
// DELETE /api/courses/:id 204 - Deletes a course and returns no content

router.get("/courses", (req, res) => {
  res.send("Hello from the other side");
});
router.get("/courses/:id", (req, res) => {});
router.post("/courses", (req, res) => {});
router.put("/courses/:id", (req, res) => {});
router.delete("/courses/:id", (req, res) => {});

module.exports = router;
