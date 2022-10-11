const moment = require("moment");

const convertArtists = (artists) => {
  return artists.split(", ");
};
const convertDate = (year, stringDate) => {
  const shortMonth = {
    JAN: "01",
    FEB: "02",
    MAR: "03",
    APR: "04",
    MAY: "05",
    JUN: "06",
    JUL: "07",
    AUG: "08",
    SEP: "09",
    OCT: "10",
    NOV: "11",
    DEC: "12",
  };
  newStr = stringDate.split(", ");
  splitedDate = newStr[1].split(" ");

  let d2 = moment([year, shortMonth[splitedDate[1]], splitedDate[0]]);
  return d2.format();
};

const convertAllEvents = (year, raEvents) => {
  return raEvents.map((event) => {
    return {
      date: convertDate(year, event.date),
      name: event.eventName,
      location: event.location,
      eventUrl: `https://ra.co${event.eventLink}`,
      artists: convertArtists(event.artist),
      imageUrl: event.picture,
    };
  });
};
module.exports = convertAllEvents;
