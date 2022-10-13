require("dotenv").config();

const REDIRECTURI = process.env.REDIRECTURI;
const CLIENTID = process.env.CLIENT_ID;
const CLIENTSECRET = process.env.CLIENT_SECRET;

const SpotifyWebApi = require("spotify-web-api-node");

// const auth_token = Buffer.from(
//   `${client_id}:${client_secret}`,
//   "utf-8"
// ).toString("base64");

// const getAuth = async () => {
//   try {
//     //make post request to SPOTIFY API for access token, sending relavent info
//     const token_url = "https://accounts.spotify.com/api/token";
//     const data = qs.stringify({ grant_type: "client_credentials" });

//     const response = await axios.post(token_url, data, {
//       headers: {
//         Authorization: `Basic ${auth_token}`,
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     });
//     //return access token
//     return response.data.access_token;
//     //console.log(response.data.access_token);
//   } catch (error) {
//     //on fail, log the error in console
//     console.log(error);
//   }
// };

const fetchArtistData = async (token, artistName) => {
  const spotifyApi = new SpotifyWebApi();
  spotifyApi.setCredentials({
    accessToken:
      "BQAUnCvt1a8Pcadg084CJDgn83-ltuLGsBnoVH6UdY9AJ3WEMvOvcZSElork8LKvTli_3rr1oqMibYZ8RS7_pZ0brrxsURj-0KQ1oszy6nsfDYpLQj4mHefqUvTWm5j15v9HpF07PjJtNa-jATavDd9PqyUOdbqkYsJCsvPBcWYjMr685McUYe6OnwUQl_sycQ",
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
