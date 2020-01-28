const Sequelize = require("sequelize");
module.exports = sequelize => {
  class Course extends Sequelize.Model {}
  Course.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      userId: {
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: {
            msg: "Please provide a Course title"
          }
        }
      },
      description: {
        type: Sequelize.TEXT,
        validate: {
          notEmpty: {
            msg: "please provide a Course description"
          }
        }
      },
      estimatedTime: {
        type: Sequelize.STRING,
        allowNull: true
      },
      materialsNeeded: {
        type: Sequelize.STRING,
        allowNull: true
      }
    },
    { sequelize }
  );
  Course.associate = models => {
    Course.belongsTo(models.User, { foreignKey: "userId" });
  };
  return Course;
};
