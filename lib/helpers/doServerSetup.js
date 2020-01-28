module.exports = function doServerSetup(express, morgan, routes) {
  const app = express();
  app.set("port", process.env.PORT || 5000);
  // setup morgan which gives us http request logging
  app.use(morgan("dev"));

  // API route setup
  app.use("/api", routes.course);
  app.use("/api", routes.user);
  // Root message
  app.get("/", (req, res) => {
    res.json({
      message: "Welcome to the REST API project!"
    });
  });
  return app;
};
