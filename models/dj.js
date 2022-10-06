"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class dj extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      dj.belongsTo(models.event, { foreignKey: "eventId" });
      dj.belongsToMany(models.genre, { through: "dj_genre" });
    }
  }
  dj.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      eventId: DataTypes.INTEGER,
      spotifyArtistId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "dj",
    }
  );
  return dj;
};
