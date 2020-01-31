module.exports = function handleEmptyBody(type, req, res, next) {
  switch (type) {
    case "user":
      if (
        req.body.hasOwnProperty("firstName") &&
        req.body.hasOwnProperty("lastName") &&
        req.body.hasOwnProperty("emailAddress") &&
        req.body.hasOwnProperty("password")
      ) {
        return true;
      } else {
        return false;
      }
    case "course":
      return res
        .status(400)
        .json({
          error: {
            type: "notEmpty violation",
            message: "Request object can not be empty"
          }
        })
        .end();
      break;
  }
};
