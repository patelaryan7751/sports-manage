"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Sport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Sport.belongsTo(models.User, {
        foreignKey: "creator_id",
        onDelete: "CASCADE",
      });
      Sport.hasMany(models.Session, {
        foreignKey: "sport_id",
        onDelete: "CASCADE",
      });
      Sport.hasMany(models.UserSession, {
        foreignKey: "sport_id",
        onDelete: "CASCADE",
      });
    }

    static getSports() {
      return Sport.findAll();
    }
    static getSportsByCreatorId(id) {
      return Sport.findAll({
        where: {
          creator_id: id,
        },
      });
    }
    static createNewSport(name, creator_id) {
      return Sport.create({
        name: name,
        creator_id: creator_id,
      });
    }
    static removeSport(id) {
      return Sport.destroy({
        where: {
          id: id,
        },
      });
    }
  }
  Sport.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Sport",
    }
  );
  return Sport;
};
