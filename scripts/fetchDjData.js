const axios = require("axios");
const qs = require("qs");
require("dotenv").config();

const client_id = process.env.CLIENT_ID; // Your client id
const client_secret = process.env.CLIENT_SECRET; // Your secret
const auth_token = Buffer.from(
  `${client_id}:${client_secret}`,
  "utf-8"
).toString("base64");

const getAuth = async () => {
  try {
    //make post request to SPOTIFY API for access token, sending relavent info
    const token_url = "https://accounts.spotify.com/api/token";
    const data = qs.stringify({ grant_type: "client_credentials" });

    const response = await axios.post(token_url, data, {
      headers: {
        Authorization: `Basic ${auth_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    //return access token
    return response.data.access_token;
    //console.log(response.data.access_token);
  } catch (error) {
    //on fail, log the error in console
    console.log(error);
  }
};

const fetchArtistData = async (token, artistName) => {
  const access_token = token;

  const parameters = { q: artistName, type: "artist", limit: 1 };

  const api_url = `https://api.spotify.com/v1/search`;
  console.log("parameters", parameters);

  try {
    const response = await axios.get(api_url, {
      params: parameters,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    //   console.log(response.data);
    if (response.data.artists.items.length !== 0) {
      return {
        id: response.data.artists.items[0].id,
        name: response.data.artists.items[0].name,
        genres: response.data.artists.items[0].genres
          ? [...response.data.artists.items[0].genres]
          : [],
      };
    } else {
      return null;
    }
  } catch (error) {
    console.log(error.message);
  }
};
//"DJ TOOL, Jeans (NL), Simone Altavilla"
// const den = async () => {
//   const to = await getAuth();
//   console.log(await fetchArtistData(to, "Parra for Cuva"));
// };
//den();
module.exports = { getAuth, fetchArtistData };
