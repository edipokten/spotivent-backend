const Playlist = require("../models").playlist;
const Artist = require("../models").artist;
const Genre = require("../models").genre;
const Event = require("../models").event;
const { Op } = require("sequelize");

const getEventsWithMatchedGenres = async (startDate, finishDate, userId) => {
  const genres = await Genre.findAll({
    include: {
      model: Artist,
      required: true,

      include: {
        model: Playlist,
        where: {
          userId: userId,
        },
      },
    },
  });
  //console.log(JSON.stringify(genres, null, 4));

  const userGenres = genres.map((genre) => {
    return genre.id;
  });

  const eventsWithMatchedGenres = await Event.findAll({
    where: {
      date: {
        [Op.between]: [startDate, finishDate],
      },
    },
    include: {
      model: Artist,
      required: true,
      include: [
        {
          model: Genre,
          where: { id: { [Op.in]: userGenres } },
        },
      ],
    },
  });
  //console.log(JSON.stringify(eventsWithMatchedGenres, null, 4));

  const eventWithGenreNames = eventsWithMatchedGenres.map((event) => {
    //console.log(JSON.stringify(event, null, 4));
    const myGenres = event.artists.map((artist) => {
      const genreNames = artist.genres.map((genre) => {
        return genre.name;
      });
      return genreNames;
    });
    return {
      id: event.id,
      genres: myGenres[0],
    };
  });
  //console.log(eventWithGenreNames);
  // console.log(JSON.stringify(eventWithGenreNames, null, 4));
  return eventWithGenreNames;
};

const getEventsWithMatchedArtists = async (startDate, finishDate, userId) => {
  const events = await Event.findAll({
    where: {
      date: {
        [Op.between]: [startDate, finishDate],
      },
    },
    include: [
      {
        model: Artist,
        required: true,

        include: [
          {
            model: Genre,
          },
          {
            model: Playlist,
            required: true,

            where: {
              userId: userId,
            },
          },
        ],
      },
    ],
  });

  const eventWithArtistIdsNames = events.map((event) => {
    return {
      id: event.id,
      artists: event.artists.map((artist) => {
        return { name: artist.name, id: artist.id };
      }),
    };
  });
  //console.log(JSON.stringify(eventWithArtistIdsNames, null, 4));
  return eventWithArtistIdsNames;
};

const matchedArtistsAndGenres = async (startDate, finishDate, userId) => {
  const artists = await getEventsWithMatchedArtists(
    startDate,
    finishDate,
    userId
  );
  const genres = await getEventsWithMatchedGenres(
    startDate,
    finishDate,
    userId
  );
  const events = await Event.findAll({
    where: {
      date: {
        [Op.between]: [startDate, finishDate],
      },
    },
    include: {
      model: Artist,
      include: [
        {
          model: Genre,
        },
      ],
    },
  });

  for (let i = 0; i < events.length; i++) {
    for (let y = 0; y < artists.length; y++) {
      if (events[i].id === artists[y].id) {
        events[i].mutualArtists = artists[y].artists;
      }
    }
  }
  for (let i = 0; i < events.length; i++) {
    for (let y = 0; y < genres.length; y++) {
      if (events[i].id === genres[y].id) {
        events[i].mutualGenres = genres[y].genres;
      }
    }
  }
  let mergedArray = [];

  events.forEach((element) => {
    if (element.mutualArtists || element.mutualGenres) {
      // console.log(element);
      mergedArray.push(element);
    }
  });
  //console.log(JSON.stringify(mergedArray, null, 4));

  console.log(mergedArray);
  return mergedArray;
};

module.exports = { matchedArtistsAndGenres };
