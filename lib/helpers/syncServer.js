module.exports = function syncServer(models, app) {
  models.sequelize
    .sync({
      force: false,
      logging: console.log("[SEQUELIZE] START SYNCING DATABASE ")
    })
    .then(() => {
      app.listen(app.get("port"), () => {
        console.log(`[SEQUELIZE] FINISHED SYNCING `);
        console.log(
          `[SERVER] Express server is listening on port ${app.get("port")}`
        );
      });
    });
};
