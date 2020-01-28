module.exports = function routeErrorHandler(app) {
  // send 404 if no other route matched
  app.use((req, res) => {
    res.status(404).json({
      message: "Route Not Found"
    });
  });
};
