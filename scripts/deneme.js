const { Router } = require("express");
const authMiddleware = require("../auth/middleware");
const User = require("../models").user;
const Playlist = require("../models").playlist;
const Artist = require("../models").artist;
const Playlist_Artist = require("../models").playlist_artist;
const Genre = require("../models").genre;
const Artist_Genre = require("../models").artist_genre;

require("dotenv").config();
const SpotifyWebApi = require("spotify-web-api-node");

const REDIRECTURI = process.env.REDIRECTURI;
const CLIENTID = process.env.CLIENT_ID;
const CLIENTSECRET = process.env.CLIENT_SECRET;

const deneme = async () => {
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

  const playlists = [
    { name: "edip's", id: "5ieJqeLJjjI8iJWaxeBLuK" },
    { name: "simge", id: "3cEYpjA9oz9GiPac4AsH4n" },
    { name: "ahmet", id: "7DVZaQfK4uLxKkF4bN9U8E" },
  ];

  const playlistWithArtists = await Promise.all(
    playlists.map(async (playlist) => {
      const promisedArtists = spotifyApi
        .getPlaylist(playlist.id)
        .then(function (data) {
          const items = data.body.tracks.items;
          const artists = items.map((item) => {
            const artistArray = item.track.artists;
            const trimmedArtists = artistArray.map((artistItem) => {
              return { spotifyArtistId: artistItem.id, name: artistItem.name };
            });
            // console.log("trimed artists", trimmedArtists[0]);
            return trimmedArtists[0];
          });
          return {
            spotifyPlaylistId: playlist.id,
            name: playlist.name,
            artists: artists,
          };

          // console.log(data.body.tracks.items[0].track.artists);
        });

      return promisedArtists;
    })
  );
  //   console.log(playlistWithArtists[0]);

  const removeDuplicates = playlistWithArtists.map((playlist) => {
    const arr = [...playlist.artists];
    const uniqueIds = new Set();

    const unique = arr.filter((element) => {
      const isDuplicate = uniqueIds.has(element.spotifyArtistId);

      uniqueIds.add(element.spotifyArtistId);

      if (!isDuplicate) {
        return true;
      }

      return false;
    });

    return {
      spotifyPlaylistId: playlist.spotifyPlaylistId,
      name: playlist.name,
      artists: unique,
    };
  });
  const playlistArtistWithGenre = await Promise.all(
    removeDuplicates.map(async (playlist) => {
      const artistIds = playlist.artists.map(
        (artist) => artist.spotifyArtistId
      );

      const artistsWithGenre = await spotifyApi
        .getArtists(artistIds)
        .then((data) => {
          return data.body.artists.map((artist) => {
            return {
              spotifyArtistId: artist.id,
              name: artist.name,
              genres: artist.genres,
            };
          });
        });
      return {
        spotifyPlaylistId: playlist.spotifyPlaylistId,
        name: playlist.name,
        artists: artistsWithGenre,
      };
    })
  );
  const user = await User.findByPk(1);
  for (let i = 0; i < playlistArtistWithGenre.length; i++) {
    const createdPlaylist = await Playlist.create({
      spotifyPlaylistId: playlistArtistWithGenre[i].spotifyPlaylistId,
      userId: user.id,
      name: playlistArtistWithGenre[i].name,
    });
    for (let y = 0; y < playlistArtistWithGenre[i].artists.length; y++) {
      const checkArtist = await Artist.findOne({
        where: {
          spotifyArtistId:
            playlistArtistWithGenre[i].artists[y].spotifyArtistId,
        },
      });
      if (checkArtist) {
        await createdPlaylist.addArtist(checkArtist, {
          through: Playlist_Artist,
        });
      } else {
        const newArtist = await Artist.create({
          name: playlistArtistWithGenre[i].artists[y].name,
          spotifyArtistId:
            playlistArtistWithGenre[i].artists[y].spotifyArtistId,
        });
        await createdPlaylist.addArtist(newArtist, {
          through: Playlist_Artist,
        });
        if (playlistArtistWithGenre[i].artists[y].genres.length !== 0) {
          for (
            let z = 0;
            z < playlistArtistWithGenre[i].artists[y].genres.length;
            z++
          ) {
            await Genre.findOne({
              where: { name: playlistArtistWithGenre[i].artists[y].genres[z] },
            }).then(async (genreData) => {
              if (genreData) {
                await newArtist.addGenre(genreData, {
                  through: Artist_Genre,
                });
              } else {
                const newGenre = await Genre.create({
                  name: playlistArtistWithGenre[i].artists[y].genres[z],
                });

                await newArtist.addGenre(newGenre, {
                  through: Artist_Genre,
                });
              }
            });
          }
        }
      }
    }
  }
};
//deneme();
const deneme2 = async () => {
  const checkGenre = await Genre.findOne({
    where: { name: "karla evelize" },
  });
  console.log("genre found?", checkGenre);

  if (checkGenre) {
    console.log("genre exists");
  } else {
    console.log("karla here");
    const newGenre = await Genre.create({
      name: "blues rock",
    });
    console.log("karla6");
  }
};
deneme();
//deneme2();
// const am = async () => {
//   const createdPlaylist = await Playlist.create({
//     spotifyPlaylistId: 3,
//     userId: 6,
//     name: "playlist.name",
//   });
// };
// am();
