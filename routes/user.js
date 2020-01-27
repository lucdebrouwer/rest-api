const express = require("express");
const router = express.Router();

// GET /api/users 200 - Returns the currently authenticated user
// POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content

router.get("/users", (req, res) => {
  res.send("Hello from the User side");
});
router.post("/users", (req, res) => {});

module.exports = router;
