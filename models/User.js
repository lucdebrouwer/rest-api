module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "firstName can not be empty"
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "lastName can not be empty"
        }
      }
    },
    emailAddress: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg:
          "Oops. Looks like you already have an account with this email address. Please try to login."
      },
      validate: {
        isEmail: {
          args: true,
          msg: "The email you entered is invalid or is already in our system."
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "password can not be empty"
        }
      }
    }
  });
  User.associate = models => {
    User.hasMany(models.Course);
  };
  return User;
};
