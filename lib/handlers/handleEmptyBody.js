module.exports = function handleEmptyBody(req, res) {
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
};
