"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class artist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      artist.belongsToMany(models.genre, { through: "artist_genre" });
      artist.belongsToMany(models.event, { through: "event_artist" });
      artist.belongsToMany(models.playlist, { through: "playlist_artist" });
    }
  }
  artist.init(
    {
      spotifyArtistId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "artist",
    }
  );
  return artist;
};
