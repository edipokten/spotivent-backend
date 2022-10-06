"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class dj_genre extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  dj_genre.init(
    {
      djId: DataTypes.INTEGER,
      genreId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "dj_genre",
    }
  );
  return dj_genre;
};
