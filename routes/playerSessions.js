/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();
const { Sport, Session, UserSession } = require("../models");

const requirePublisher = (req, res, next) => {
  if (req.user && req.user.role === "player") {
    return next();
  } else {
    res.render("./pages/404");
  }
};

router.get("/", requirePublisher, async (request, response) => {
  const userId = request.user.id;
  const createdSessions = await Session.findAll({
    where: { creator_id: userId },
    include: [
      {
        model: Sport,
        attributes: ["name"],
      },
    ],
  });
  const joinedSessions = await UserSession.findAll({
    where: { userId: userId },
    include: [
      {
        model: Session,
        attributes: [
          "time",
          "place",
          "numberOfPlayers",
          "isCancelled",
          "sport_id",
          "id",
        ],
        include: [
          {
            model: Sport,
            attributes: ["name"],
          },
        ],
      },
    ],
  });
  const todaysCreatedSessions = createdSessions.filter((session) => {
    const today = new Date();
    const sessionDate = new Date(session.time);
    if (
      sessionDate.getDate() === today.getDate() &&
      sessionDate.getMonth() === today.getMonth() &&
      sessionDate.getFullYear() === today.getFullYear()
    ) {
      return true;
    }
  });
  const todaysJoinedSessions = joinedSessions.filter((session) => {
    const today = new Date();
    const sessionDate = new Date(session.Session.time);
    if (
      sessionDate.getDate() === today.getDate() &&
      sessionDate.getMonth() === today.getMonth() &&
      sessionDate.getFullYear() === today.getFullYear()
    ) {
      return true;
    }
  });

  const removedDuplicateSessionFromTodaysJoinedSessions =
    todaysJoinedSessions.filter((session) => {
      if (
        todaysCreatedSessions.find(
          (createdSession) =>
            Number(createdSession.id) === Number(session.sessionId)
        )
      ) {
        return false;
      }
      return true;
    });
  response.render("./pages/playerSessions", {
    user: request.user,
    createdSessions: await Session.getSessionByCreatorId(userId),
    joinedSessions: await UserSession.getUserSessionByUserId(userId),
    todaysCreatedSessions: todaysCreatedSessions,
    todaysJoinedSessions: removedDuplicateSessionFromTodaysJoinedSessions,
    csrfToken: request.csrfToken(),
  });
});

router.get("/todaysSessions", requirePublisher, async (request, response) => {
  const userId = request.user.id;
  const createdSessions = await Session.findAll({
    where: { creator_id: userId },
    include: [
      {
        model: Sport,
        attributes: ["name"],
      },
    ],
  });
  const joinedSessions = await UserSession.findAll({
    where: { userId: userId },
    include: [
      {
        model: Session,
        attributes: [
          "time",
          "place",
          "numberOfPlayers",
          "isCancelled",
          "sport_id",
          "id",
        ],
        include: [
          {
            model: Sport,
            attributes: ["name"],
          },
        ],
      },
    ],
  });
  const todaysCreatedSessions = createdSessions.filter((session) => {
    const today = new Date();
    const sessionDate = new Date(session.time);
    if (
      sessionDate.getDate() === today.getDate() &&
      sessionDate.getMonth() === today.getMonth() &&
      sessionDate.getFullYear() === today.getFullYear()
    ) {
      return true;
    }
  });
  const todaysJoinedSessions = joinedSessions.filter((session) => {
    const today = new Date();
    const sessionDate = new Date(session.Session.time);
    if (
      sessionDate.getDate() === today.getDate() &&
      sessionDate.getMonth() === today.getMonth() &&
      sessionDate.getFullYear() === today.getFullYear()
    ) {
      return true;
    }
  });

  const removedDuplicateSessionFromTodaysJoinedSessions =
    todaysJoinedSessions.filter((session) => {
      if (
        todaysCreatedSessions.find(
          (createdSession) =>
            Number(createdSession.id) === Number(session.sessionId)
        )
      ) {
        return false;
      }
      return true;
    });
  response.render("./pages/playerTodaysSession", {
    user: request.user,
    todaysCreatedSessions: todaysCreatedSessions,
    todaysJoinedSessions: removedDuplicateSessionFromTodaysJoinedSessions,
    csrfToken: request.csrfToken(),
  });
});
router.get("/createdSessions", requirePublisher, async (request, response) => {
  const userId = request.user.id;
  const createdSessions = await Session.findAll({
    where: { creator_id: userId },
    include: [
      {
        model: Sport,
        attributes: ["name"],
      },
    ],
  });
  response.render("./pages/playerCreatedSession", {
    user: request.user,
    createdSessions: createdSessions,
    csrfToken: request.csrfToken(),
  });
});

router.get("/joinedSessions", requirePublisher, async (request, response) => {
  const userId = request.user.id;
  const joinedSessions = await UserSession.findAll({
    where: { userId: userId },
    include: [
      {
        model: Session,
        attributes: [
          "time",
          "place",
          "numberOfPlayers",
          "isCancelled",
          "sport_id",
          "id",
        ],
        include: [
          {
            model: Sport,
            attributes: ["name"],
          },
        ],
      },
    ],
  });
  console.log(joinedSessions);
  response.render("./pages/playerJoinedSession", {
    user: request.user,
    joinedSessions: joinedSessions,
    csrfToken: request.csrfToken(),
  });
});

module.exports = router;
