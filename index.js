const express = require("express");
const cors = require("cors");

const SpotifyAuthRouter = require("./routers/spotifyAuth.js");

const PORT = process.env.PORT || 8888;
const application = express();

application.use(express.json());
application.use(cors());

application.use("/api", cors(), SpotifyAuthRouter);

application.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
