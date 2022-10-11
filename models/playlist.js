"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class playlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      playlist.belongsTo(models.user, { foreignKey: "userId" });
      playlist.belongsToMany(models.artist, { through: "playlist_artist" });
    }
  }
  playlist.init(
    {
      spotifyPlaylistId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      userId: DataTypes.INTEGER,
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "playlist",
    }
  );
  return playlist;
};
