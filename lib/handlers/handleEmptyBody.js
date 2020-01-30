module.exports = function handleEmptyBody(req, res) {
  console.log(
    `EVAL 1: ${req.body.hasOwnProperty(
      "firstName"
    )}, EVAL 2: ${req.body.hasOwnProperty(
      "lastName"
    )}, EVAL 3: ${req.body.hasOwnProperty(
      "emailAddress"
    )}, EVAL 4: ${req.body.hasOwnProperty("password")}`
  );
  if (
    req.body.hasOwnProperty("firstName") &&
    req.body.hasOwnProperty("lastName") &&
    req.body.hasOwnProperty("emailAddress") &&
    req.body.hasOwnProperty("password")
  ) {
    console.log("[HandleEmptyBody] I GOT ALL PROPS ");
    return true;
  } else {
    console.log("[HandleEmptyBody] I HAVE MISSING PROPS");
    return false;
  }
};
