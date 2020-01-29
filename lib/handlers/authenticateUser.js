const { auth, bcrypt } = require("../../modules/");
const models = require("../../models");

module.exports = async function authenticateUser(req, res, next) {
  let message = null;
  const credentials = auth(req);
  console.log(credentials);
  // Retrieve the credentials out of the Authorization header
  // If the header/credentials are present, find the matching user.
  // We don't want to return the password,  updatedAt and createdAt fields.
  // NOTE: We could've done this with attributes: ['id', etc..] but bcrypt will throw an error it can't sync passwords.
  if (credentials) {
    await models.User.findOne({
      where: {
        emailAddress: credentials.name
      }
    })
      .then(usr => {
        // If user was found, create a new user object to exclude the fields we don't want to return
        if (usr) {
          const user = {
            id: usr.id,
            firstName: usr.firstName,
            lastName: usr.lastName,
            emailAddress: usr.emailAddress
          };
          // Check for authentication, notice "usr" instead of "user".
          const authenticated = bcrypt.compareSync(
            credentials.pass,
            usr.password
          );
          if (authenticated) {
            console.log(
              `Authentication successful for username: ${user.emailAddress}`
            );
            // This will return the current authenticated user back to the protected route
            req.currentUser = user;
          } else {
            message = `Authentication failure for username: ${user.emailAddress}`;
          }
        } else {
          message = `User not found for username: ${credentials.name}`;
        }
      })
      .catch(error => {
        next(error);
      });
  } else {
    message = "Auth header not found";
    res.status(404).end();
  }
  if (message) {
    console.warn(message);
    res
      .status(403)
      .json({ message: "Access Denied" })
      .end();
  } else {
    next();
  }
};
