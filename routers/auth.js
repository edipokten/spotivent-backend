const express = require("express");
const router = express.Router();
const User = require("../models").user;
const { toJWT } = require("../auth/jwt");
const SpotifyWebApi = require("spotify-web-api-node");
require("dotenv").config();

const REDIRECTURI = process.env.REDIRECTURI;
const CLIENTID = process.env.CLIENT_ID;
const CLIENTSECRET = process.env.CLIENT_SECRET;

require("dotenv").config();

router.get("/login", async (req, res) => {
  // check if you have a code for this user, if not get the code
  const scopes = ["user-read-private", "user-read-email"],
    state = "some-state-of-my-choice";

  // Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
  const spotifyApi = new SpotifyWebApi({
    redirectUri: REDIRECTURI,
    clientId: CLIENTID,
  });

  // Create the authorization URL
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
  console.log(authorizeURL);

  res.redirect(authorizeURL);
});
router.get("/logged", async (req, res) => {
  const credentials = {
    clientId: CLIENTID,
    clientSecret: CLIENTSECRET,
    redirectUri: REDIRECTURI,
  };

  const spotifyApi = new SpotifyWebApi(credentials);

  // The code that's returned as a query parameter to the redirect URI
  var code = req.query.code;

  // Retrieve an access token and a refresh token
  spotifyApi.authorizationCodeGrant(code).then(
    function (authCodeData) {
      console.log("access", authCodeData.body["access_token"]);
      console.log("refresh", authCodeData.body["refresh_token"]);

      spotifyApi.setAccessToken(authCodeData.body["access_token"]);
      spotifyApi.setRefreshToken(authCodeData.body["refresh_token"]);
      spotifyApi.getMe().then(
        async (data) => {
          const checkUser = await User.findOne({
            where: { spotifyUserId: data.body.id },
          });
          const getUserWithToken = async () => {
            if (checkUser) {
              checkUser.spotifyUserId = data.body.id;
              checkUser.spotifyToken = authCodeData.body["access_token"];
              checkUser.spotifyRefreshToken =
                authCodeData.body["refresh_token"];
              checkUser.image = data.body.images[0].url;
              checkUser.name = data.body.display_name;
              await checkUser.save();

              console.log(checkUser);

              return {
                spotifyUserId: data.body.id,
                token: toJWT({ userId: checkUser.id }),
                spotifyUserId: data.body.id,
                image: data.body.images[0].url,
                name: data.body.display_name,
              };
            } else {
              const createdUser = await User.create({
                spotifyUserId: data.body.id,
                spotifyToken: authCodeData.body["access_token"],
                spotifyRefreshToken: authCodeData.body["refresh_token"],
                image: data.body.images[0].url,
                name: data.body.display_name,
              });
              return {
                spotifyUserId: data.body.id,
                token: toJWT({ userId: createdUser.id }),
                spotifyUserId: data.body.id,
                image: data.body.images[0].url,
                name: data.body.display_name,
              };
            }
          };
          const user = await getUserWithToken();
          res.json(user);
        },
        function (err) {
          console.log("Something went wrong!", err);
        }
      );

      // Set the access token on the API object to use it in later calls
    },
    function (err) {
      console.log("Something went wrong!", err);
    }
  );
});

module.exports = router;
