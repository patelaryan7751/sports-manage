"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserSession extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserSession.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
      UserSession.belongsTo(models.Session, {
        foreignKey: "sessionId",
        onDelete: "CASCADE",
      });
      UserSession.belongsTo(models.Sport, {
        foreignKey: "sport_id",
        onDelete: "CASCADE",
      });
    }
    static getUserSessions() {
      return UserSession.findAll();
    }
    static getUserSessionByUserId(id) {
      return UserSession.findAll({
        where: {
          userId: id,
        },
      });
    }
    static addPlayerToSession(userId, sessionId, sport_id) {
      return UserSession.create({
        userId: userId,
        sessionId: sessionId,
        sport_id: sport_id,
      });
    }
    static playerLeaveSession(userId, sessionId) {
      return UserSession.destroy({
        where: {
          userId: userId,
          sessionId: sessionId,
        },
      });
    }
  }
  UserSession.init(
    {
      userId: DataTypes.INTEGER,
      sessionId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "UserSession",
    }
  );
  return UserSession;
};
