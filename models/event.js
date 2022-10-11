"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      event.belongsToMany(models.artist, { through: "event_artist" });
    }
  }
  event.init(
    {
      name: DataTypes.STRING,
      date: DataTypes.DATE,
      location: DataTypes.STRING,
      eventUrl: DataTypes.TEXT,
      imageUrl: DataTypes.TEXT,
      city: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "event",
    }
  );
  return event;
};
