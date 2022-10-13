let fs = require("fs");
const Genre = require("../models").genre;

fs.readFile("all_spotify_genres.txt", async function (err, data) {
  if (err) throw err;
  var array = data.toString().split("\n");
  for (i in array) {
    const newGenre = await Genre.create({
      name: array[i],
    });
  }
});
