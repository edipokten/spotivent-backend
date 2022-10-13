const express = require("express");
const cors = require("cors");
const AuthRoutes = require("./routers/auth");
const UserRoutes = require("./routers/user");

//const SpotifyAuthRouter = require("./scripts/getDjData.js");

const PORT = process.env.PORT || 8888;
const application = express();

application.use(express.json());
application.use(express.urlencoded({ extended: true }));
application.use(cors());

application.use("/api", cors(), AuthRoutes);
application.use("/user", cors(), UserRoutes);

application.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
