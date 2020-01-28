module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define("Course", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Please provide a Course title"
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {
          msg: "please provide a Course description"
        }
      }
    },
    estimatedTime: {
      type: DataTypes.STRING,
      allowNull: true
    },
    materialsNeeded: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });
  Course.associate = models => {
    Course.belongsTo(models.User);
  };
  return Course;
};
