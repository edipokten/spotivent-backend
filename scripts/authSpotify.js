require("dotenv").config();

const REDIRECTURI = process.env.REDIRECTURI;
const CLIENTID = "e5104813b15c4b24a019c7bd7423eeb0";
const CLIENTSECRET = "3a8b7f9b9f6445cd80058e8c9d21abdd";

const SpotifyWebApi = require("spotify-web-api-node");

const getAuth = async () => {
  try {
    // Create the api object with the credentials
    const credentials = {
      clientId: CLIENTID,
      clientSecret: CLIENTSECRET,
    };
    console.log("credit", credentials);

    const spotifyApi = new SpotifyWebApi(credentials);

    // Retrieve an access token.
    spotifyApi.clientCredentialsGrant().then(
      function (data) {
        console.log("The access token expires in " + data.body["expires_in"]);
        console.log("The access token is " + data.body["access_token"]);

        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(data.body["access_token"]);
      },
      function (err) {
        console.log(
          "Something went wrong when retrieving an access token",
          err
        );
      }
    );
  } catch (error) {
    //on fail, log the error in console
    console.log(error);
  }
};
getAuth();
