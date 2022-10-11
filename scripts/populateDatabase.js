const raEvents = require("./dummyEventData.js");
const convertAllEvents = require("./trimEvents.js");
const { fetchArtistData, getAuth } = require("./fetchDjData.js");
const Artist = require("../models").artist;
const Genre = require("../models").genre;
const Event = require("../models").event;
const Event_Artist = require("../models").event_artist;
const Artist_Genre = require("../models").artist_genre;
const allEvents = convertAllEvents("2022", raEvents);
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// const mockArtists = ["snoopdog", "blink", "bla"];

// const allWithDelay = async (ps, delay) => {
//   for (let i = 0; i < ps.length; i++) {
//     await sleep(delay * (i + 1)).then(async () => {
//       await ps[i];
//     });
//   }
// };

// const runCheck = async () => {
//   const token = await getAuth();
//   await allWithDelay(
//     mockArtists.map(async (a) => console.log(await fetchArtistData(token, a))),
//     1000
//   );
// };

//runCheck();

const createEvents = async () => {
  const token = await getAuth();
  const fetchedEventData = async () => {
    return await Promise.all(
      allEvents.map(async (event) => {
        const eventArtists = event.artists;

        const fetchedArtists = await Promise.all(
          eventArtists.map(async (artist) => {
            const fetchedData = await fetchArtistData(token, artist);

            console.log(fetchedData);
            if (fetchedData !== null) {
              return fetchedData;
            }
          })
        );
        const newEventArtists = event;
        newEventArtists.artists = [...fetchedArtists];
        return newEventArtists;
      })
    );
  };
  const promisedData = await fetchedEventData();
  //   const removeUndefined = promisedData.map((event) => {
  //     const trimmedArtists = event.artists.map((artist) => {
  //       if (artist !== undefined) {
  //         return artist;
  //       } else {
  //         console.log("bulunmayan");
  //       }
  //     });
  //     return {
  //       name: event.name,
  //       date: event.date,
  //       location: event.location,
  //       eventUrl: event.eventUrl,
  //       imageUrl: event.imageUrl,
  //       artists: [...trimmedArtists],
  //     };
  //   });

  //console.log("promise data", promisedData[0].artists);
  console.log(promisedData);

  promisedData.forEach(async (item) => {
    const event = await Event.create({
      name: item.name,
      date: item.date,
      location: item.location,
      eventUrl: item.eventUrl,
      imageUrl: item.imageUrl,
    });
    if (item.artists.length !== 0) {
      const newArtistArray = [...item.artists];
      newArtistArray.forEach(async (artist) => {
        if (artist !== undefined) {
          const checkArtist = await Artist.findOne({
            where: { spotifyArtistId: artist.id },
          });
          if (checkArtist !== null) {
            await event.addArtist(checkArtist, { through: Event_Artist });
          } else {
            const newArtist = await Artist.create({
              name: artist.name,
              spotifyArtistId: artist.id,
            });

            await event.addArtist(newArtist, { through: Event_Artist });
            if (artist.genres.length !== 0) {
              const newGenreArray = [...artist.genres];
              newGenreArray.forEach(async (genre) => {
                if (genre !== undefined) {
                  const checkGenre = await Genre.findOne({
                    where: { name: genre },
                  });
                  if (checkGenre !== null) {
                    console.log("My-Artist:", artist);
                    await artist.addGenre(checkGenre, {
                      through: Artist_Genre,
                    });
                  } else {
                    console.log("My-Artist:2", artist);

                    const newGenre = await Genre.create({
                      name: genre,
                    });
                    await newArtist.addGenre(newGenre, {
                      through: Artist_Genre,
                    });
                  }
                }
              });
            }
          }
        }
      });
    }
  });
};
// const ddd = async () => {
//   await Event.create({
//     name: "d",
//     date: "2022-11-15T00:00:00+01:00",
//     location: "d",
//     eventUrl: "item.eventUrl",
//     imageUrl: "item.imageUrl",
//     city: "ams",
//   });
// };
// ddd();
createEvents();

// const genres = [1,2,3,4];
// let genreObjs = []
// for (genre in genres) {
//     const newGenre = await genre.findByPk(genre);
//     genreObjs = [...genreObjs, newGenre.id]
// }
