const { Router } = require("express");
const axios = require("axios");
const qs = require("qs");
require("dotenv").config();

const client_id = process.env.CLIENT_ID; // Your client id
const client_secret = process.env.CLIENT_SECRET; // Your secret
const auth_token = Buffer.from(
  `${client_id}:${client_secret}`,
  "utf-8"
).toString("base64");

const router = new Router();

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

const getAudioFeatures_Track = async (track_id) => {
  //request token using getAuth() function
  const access_token = await getAuth();
  console.log(access_token);

  const api_url = `https://api.spotify.com/v1/audio-features/${track_id}`;
  //console.log(api_url);
  try {
    const response = await axios.get(api_url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const getArtistIdAndGenre = async (artistName) => {
  const access_token = await getAuth();

  //   console.log(access_token);
  const parameters = { q: artistName, type: "artist", limit: 1 };
  //   const encoded = encodeURI(parameters);
  //   console.log(encoded);

  const api_url = `https://api.spotify.com/v1/search`;

  try {
    const response = await axios.get(api_url, {
      params: parameters,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    console.log(response.data);
    return {
      id: response.data.artists.items[0].id,
      name: response.data.artists.items[0].name,
      genres: response.data.artists.items[0].genres,
    };
  } catch (error) {
    console.log(error);
  }
};

// getAudioFeatures_Track("07A0whlnYwfWfLQy4qh3Tq").then((item) => {
//   console.log(item);
// });
getArtistIdAndGenre("astrix").then((data) => {
  console.log(data);
});
