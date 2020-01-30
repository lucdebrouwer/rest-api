const { auth, bcrypt } = require("../../modules/");
const models = require("../../models");

module.exports = async function authenticateUser(req, res, next) {
  let message = null;
  const credentials = auth(req);
  console.log(credentials);
  // Retrieve the credentials out of the Authorization header
  // If the header/credentials are present, find the matching user.
  if (credentials) {
    if (credentials.name === "" || credentials.pass === "") {
      res
        .status(400)
        .json({
          error:
            "Username or password was empty, please provide the required fields"
        })
        .end();
    } else {
      await models.User.findOne({
        where: {
          emailAddress: credentials.name
        }
      })
        .then(usr => {
          // We don't want to return the password,  updatedAt and createdAt fields.
          // NOTE: We could've done this with attributes: ['id', etc..] but bcrypt will throw an error it can't sync passwords.
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
              next();
            } else {
              console.log(
                `Authentication failure for username: ${user.emailAddress}`
              );
              res
                .status(401)
                .json({
                  message:
                    "Invalid credentials: make sure to provide a valid username and password combination"
                })
                .end();
            }
          } else {
            console.log(usr);
            console.log(
              `Authentication failure for username: ${credentials.name}`
            );
            res
              .status(401)
              .json({ message: "User does not exist" })
              .end();
          }
        })
        .catch(error => {
          next(error);
        });
    }
  } else {
    message = "Auth header not found";
    res
      .status(401)
      .json({ message: message })
      .end();
  }
};
