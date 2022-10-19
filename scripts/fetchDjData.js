require("dotenv").config();

const REDIRECTURI = process.env.REDIRECTURI;
const CLIENTID = process.env.CLIENT_ID;
const CLIENTSECRET = process.env.CLIENT_SECRET;

const SpotifyWebApi = require("spotify-web-api-node");

const fetchArtistData = async (token, artistName) => {
  const spotifyApi = new SpotifyWebApi();
  spotifyApi.setCredentials({
    accessToken:
      "BQBOOt_JE5IvtFjxI3cAF2OE9HjzessKkrbDRvN5F-3JY3b4AAOdmrqnml46XvcjvCiTvQni47TdqYcBGeTiXkE7fPWfk1tQa6gJpFIrE4H1t4oeoSk",
    refreshToken:
      "AQCMrGtZkscF5sEeBJGduf9qFD0LBzXCgEOlZiDPKASJLoJGCYB17eMOSIWRHWUGYbOx5grzPFfufogzoMjn9-tWlELI2-HSUBZ5iyFs1QGFZr14EJe9PPMvZ9dLq28Jj2E",
    redirectUri: REDIRECTURI,
    "clientId ": CLIENTID,
    clientSecret: CLIENTSECRET,
  });

  const result = spotifyApi.searchArtists(artistName, { limit: 1 }).then(
    function (data) {
      //console.log(artistName, data.body);
      if (data.body.artists.items.length !== 0) {
        return {
          id: data.body.artists.items[0].id,
          name: data.body.artists.items[0].name,
          genres: data.body.artists.items[0].genres
            ? [...data.body.artists.items[0].genres]
            : [],
        };
      } else {
        return null;
      }
    },
    function (err) {
      console.error(err);
    }
  );
  return result;
};
module.exports = { fetchArtistData };
