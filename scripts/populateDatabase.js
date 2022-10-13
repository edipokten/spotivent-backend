const raEvents = require("./dummyEventData.js");
const convertAllEvents = require("./trimEvents.js");
const { fetchArtistData } = require("./fetchDjData.js");
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
  const fetchedEventData = async () => {
    return await Promise.all(
      allEvents.map(async (event) => {
        const eventArtists = event.artists;

        const fetchedArtists = await Promise.all(
          eventArtists.map(async (artist) => {
            const fetchedData = await fetchArtistData("token", artist);

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

  // console.log(promisedData);

  //   data = data.filter(function( element ) {
  //     return element !== undefined;
  //  });

  const trimmedData = promisedData.map((event) => {
    const artists = event.artists.filter(function (element) {
      return element !== undefined;
    });

    const trimmedArtists = artists.map((artist) => {
      const trimmedGenres = artist.genres.filter(function (el) {
        return el !== undefined;
      });
      return {
        id: artist.id,
        name: artist.name,
        genres: [...trimmedGenres],
      };
    });

    // const artists = event.artists.map((artist) => {
    //   if (artist !== undefined) {
    //     console.log(" not undefined artist", artist);
    //     const genres = artist.genres.map((genre) => {
    //       if (genre !== undefined) {
    //         return genre;
    //       }
    //     });
    //     return {
    //       id: artist.id,
    //       name: artist.name,
    //       genres: [...genres],
    //     };
    //   }
    // });
    return {
      date: event.date,
      name: event.name,
      location: event.location,
      eventUrl: event.eventUrl,
      imageUrl: event.imageUrl,
      artists: [...trimmedArtists],
    };
  });
  for (let z = 0; z < trimmedData.length; z++) {
    const event = await Event.create({
      name: trimmedData[z].name,
      date: trimmedData[z].date,
      location: trimmedData[z].location,
      eventUrl: trimmedData[z].eventUrl,
      imageUrl: trimmedData[z].imageUrl,
    });
    if (trimmedData[z].artists.length !== 0) {
      const newArtistArray = [...trimmedData[z].artists];

      for (let i = 0; i < newArtistArray.length; i++) {
        const checkArtist = await Artist.findOne({
          where: { spotifyArtistId: newArtistArray[i].id },
        });
        if (checkArtist !== null) {
          await event.addArtist(checkArtist, { through: Event_Artist });
        } else {
          const newArtist = await Artist.create({
            name: newArtistArray[i].name,
            spotifyArtistId: newArtistArray[i].id,
          });

          await event.addArtist(newArtist, { through: Event_Artist });

          if (newArtistArray[i].genres.length !== 0) {
            const newGenreArray = [...newArtistArray[i].genres];

            for (let j = 0; j < newGenreArray.length; j++) {
              const checkGenre = await Genre.findOne({
                where: { name: newGenreArray[j] },
              });
              if (checkGenre !== null) {
                await newArtist.addGenre(checkGenre, {
                  through: Artist_Genre,
                });
              } else {
                const newGenre = await Genre.create({
                  name: newGenreArray[j],
                });
                await newArtist.addGenre(newGenre, {
                  through: Artist_Genre,
                });
              }
            }
            // newGenreArray.forEach(async (genre) => {
            //   const checkGenre = await Genre.findOne({
            //     where: { name: genre },
            //   });
            //   if (checkGenre !== null) {
            //     console.log("My-Artist:", artist);
            //     await newArtist.addGenre(checkGenre, {
            //       through: Artist_Genre,
            //     });
            //   } else {
            //     console.log("My-Artist:2", artist);

            //     const newGenre = await Genre.create({
            //       name: genre,
            //     });
            //     await newArtist.addGenre(newGenre, {
            //       through: Artist_Genre,
            //     });
            //   }
            // });
          }
        }
      }
    }
  }
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
