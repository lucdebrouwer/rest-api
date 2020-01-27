const Sequelize = require("sequelize");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "../fsjstd-restapi.db"
});
const db = {
  sequelize,
  Sequelize,
  models: {}
};

db.models.Course = require("./models/Course")(sequelize);
db.models.User = require("./models/User")(sequelize);
module.exports = db;
