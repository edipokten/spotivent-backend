const { Router } = require("express");
const authMiddleware = require("../auth/middleware");
const User = require("../models").user;
const Playlist = require("../models").playlist;
const Artist = require("../models").artist;
require("dotenv").config();

const REDIRECTURI = process.env.REDIRECTURI;
const CLIENTID = process.env.CLIENT_ID;
const CLIENTSECRET = process.env.CLIENT_SECRET;

const SpotifyWebApi = require("spotify-web-api-node");
// const router = new Router();
// router.get("/playlist", authMiddleware, async (req, res, next) => {
//   try {
//     const user = req.user;
//     const spotifyApi = new SpotifyWebApi();

//     spotifyApi.setCredentials({
//       accessToken: user.spotifyToken,
//       refreshToken: user.spotifyRefreshToken,
//       redirectUri: REDIRECTURI,
//       "clientId ": CLIENTID,
//       clientSecret: CLIENTSECRET,
//     });
//     spotifyApi.getUserPlaylists().then(
//       function (data) {
//         console.log("Retrieved playlists", data.body);
//       },
//       function (err) {
//         console.log("Something went wrong!", err);
//       }
//     );
//   } catch (error) {
//     console.log(error);
//     return res.status(400).send({ message: "Something went wrong, sorry" });
//   }
// });
// module.exports = router;

const deneme = () => {
  const spotifyApi = new SpotifyWebApi();

  spotifyApi.setCredentials({
    accessToken:
      "BQBsmIZYwazARCqGgUHr3aue3FGWDjG8pHRYhMa6c0tVsZSLR4q9odeNmsrJdGiAXwIca1WQB0tV_Q5Fc2lDZmlbkKiGmN8aoth9-2w2s9GWedJ1HvfEt2MeAO1A_DkUR6Aarja856O2gklhAbGXY8c2VBKI0IIKPBQQAnpd6cu7fuDrMyIiVY2W_QycfRg3Kg",
    refreshToken:
      "AQAH9N1ZkY-7Nmv7p7fj_5P9ZhtowAI3-wiDcHVZuYwYScsyLR1ZNrj6FmuaLW9FSwbuSjut0IfseYqWkvyf2R5VlCPuc9g32_cWn0UwgYCfcvwjbf46epF-LisqmAgQ4BA",
    redirectUri: REDIRECTURI,
    "clientId ": CLIENTID,
    clientSecret: CLIENTSECRET,
  });
  spotifyApi.getUserPlaylists().then(
    function (data) {
      console.log("Retrieved playlists", data.body);
    },
    function (err) {
      console.log("Something went wrong!", err);
    }
  );
};
deneme();
