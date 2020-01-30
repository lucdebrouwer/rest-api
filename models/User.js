module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg:
              "Please provide a value for firstName, firstName can not be empty"
          },
          notNull: {
            msg:
              "Please provide a value for firstName, firstName can not be null"
          }
        }
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Please provide a value for lastName can not be empty"
          },
          notNull: {
            msg: "Please provide a value for lastName, lastName can not be null"
          }
        }
      },
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            args: true,
            msg: "Please provide a valid formatted email address"
          },
          notNull: {
            msg: "Please provide an email address, email can not be null"
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Please provide a valid password, password can not be empty"
          },
          notNull: {
            msg: "Please provide a valid password, password can not be null"
          }
        }
      }
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["emailAddress"]
        }
      ]
    }
  );
  User.associate = models => {
    User.hasMany(models.Course);
  };
  return User;
};
