const Sequelize = require("sequelize");

module.exports = sequelize => {
  class User extends Sequelize.Model {}
  User.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      firstName: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: {
            msg: "Please provide a first name"
          }
        }
      },
      lastName: {
        type: Sequelize.STRING,
        validate: {
          NotEmpty: {
            msg: "Please provide a last name"
          }
        }
      },
      emailAddress: {
        type: Sequelize.STRING,
        isEmail: true,
        validate: {
          isEmail: {
            msg: "Please provide a valid email address"
          },
          unique: {
            msg: "Please try a different email address"
          },
          notEmpty: {
            msg: "Please provide an email address"
          }
        }
      },
      password: {
        type: Sequelize.STRING,
        validate: {
          len: [6, 20],
          isEmpty: {
            msg: "Please provide a password"
          }
        }
      }
    },
    { sequelize }
  );
  User.associate = models => {
    User.hasMany(models.Course, { foreignKey: "userId", as: "Course" });
  };
  return User;
};
