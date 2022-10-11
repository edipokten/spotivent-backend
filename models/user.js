"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      user.hasMany(models.playlist, { foreignKey: "playlistId" });
    }
  }
  user.init(
    {
      spotifyUserId: { type: DataTypes.STRING, unique: true, allowNull: false },
      spotifyToken: DataTypes.TEXT,
      spotifyRefreshToken: DataTypes.TEXT,
      image: DataTypes.TEXT,
      name: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "user",
    }
  );
  return user;
};
