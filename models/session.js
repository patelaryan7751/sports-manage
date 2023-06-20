"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Session extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Session.hasMany(models.UserSession, {
        foreignKey: "sessionId",
        onDelete: "CASCADE",
      });
      Session.belongsTo(models.User, {
        foreignKey: "creator_id",
        onDelete: "CASCADE",
      });
      Session.belongsTo(models.Sport, {
        foreignKey: "sport_id",
        onDelete: "CASCADE",
      });
    }
    static getSessions() {
      return Session.findAll();
    }
    static getSessionBySportId(id) {
      return Session.findAll({
        where: {
          sport_id: id,
        },
      });
    }
  }
  Session.init(
    {
      time: DataTypes.DATE,
      place: DataTypes.STRING,
      numberOfPlayers: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Session",
    }
  );
  return Session;
};
