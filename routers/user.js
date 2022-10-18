const { Router } = require("express");
const authMiddleware = require("../auth/middleware");
const User = require("../models").user;
const Playlist = require("../models").playlist;
const Artist = require("../models").artist;
const Playlist_Artist = require("../models").playlist_artist;
const Genre = require("../models").genre;
const Artist_Genre = require("../models").artist_genre;

const router = new Router();
router.get("/playlist", authMiddleware, async (req, res, next) => {
  try {
    const spotifyApi = req.spotifyApi;

    spotifyApi.getUserPlaylists().then(
      function (data) {
        const playLists = data.body.items.map((playlist) => {
          return { spotifyPlaylistId: playlist.id, name: playlist.name };
        });
        res.json(playLists);
      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});
router.get("/profile", authMiddleware, async (req, res, next) => {
  try {
    const user = req.user;
    const importedPlaylists = await Playlist.findAll({
      where: { userId: user.id },
    });
    console.log(importedPlaylists);
    const profile = {
      spotifyUserId: user.spotifyUserId,
      name: user.name,
      image: user.image,
      importedPlaylists: importedPlaylists,
    };

    res.status(200).send(profile);
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});

router.post("/playlist", authMiddleware, async (req, res, next) => {
  try {
    const spotifyApi = req.spotifyApi;
    console.log("simge", req.body);
    const playlists = req.body.playlists;
    const user = req.user;

    const playlistWithArtists = await Promise.all(
      playlists.map(async (playlist) => {
        console.log("spplaylistId", playlist.spotifyPlaylistId);
        const promisedArtists = spotifyApi
          .getPlaylist(playlist.spotifyPlaylistId)
          .then(function (data) {
            const items = data.body.tracks.items;

            const artists = items.map((item) => {
              const artistArray = item.track.artists;

              const trimmedArtists = artistArray.map((artistItem) => {
                return {
                  spotifyArtistId: artistItem.id,
                  name: artistItem.name,
                };
              });
              return trimmedArtists[0];
            });

            return {
              spotifyPlaylistId: playlist.spotifyPlaylistId,
              name: playlist.name,
              artists: artists,
            };
          });

        return promisedArtists;
      })
    );

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

    for (let i = 0; i < playlistArtistWithGenre.length; i++) {
      const [createdOrFoundPlaylist, created] = await Playlist.findOrCreate({
        where: {
          spotifyPlaylistId: playlistArtistWithGenre[i].spotifyPlaylistId,
          userId: user.id,
        },
        defaults: {
          name: playlistArtistWithGenre[i].name,
        },
      });

      for (let y = 0; y < playlistArtistWithGenre[i].artists.length; y++) {
        const checkArtist = await Artist.findOne({
          where: {
            spotifyArtistId:
              playlistArtistWithGenre[i].artists[y].spotifyArtistId,
          },
        });
        if (checkArtist) {
          await createdOrFoundPlaylist.addArtist(checkArtist, {
            through: Playlist_Artist,
          });
        } else {
          const newArtist = await Artist.create({
            name: playlistArtistWithGenre[i].artists[y].name,
            spotifyArtistId:
              playlistArtistWithGenre[i].artists[y].spotifyArtistId,
          });
          await createdOrFoundPlaylist.addArtist(newArtist, {
            through: Playlist_Artist,
          });
          if (playlistArtistWithGenre[i].artists[y].genres.length !== 0) {
            for (
              let z = 0;
              z < playlistArtistWithGenre[i].artists[y].genres.length;
              z++
            ) {
              await Genre.findOne({
                where: {
                  name: playlistArtistWithGenre[i].artists[y].genres[z],
                },
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
    return res.status(200).send({ message: "Playlists imported" });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});

module.exports = router;
