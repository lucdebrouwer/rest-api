/**
 * @argument models
 * @description Tests the database connection
 */
module.exports = function testAuth(models) {
  models.sequelize
    .authenticate()
    .then(() => {
      console.log("[CONNECTION] Connection has been established successfully.");
    })
    .catch(err => {
      console.error("[CONNECTION] Unable to connect to the database:", err);
    });
};
