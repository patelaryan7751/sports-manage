/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();
const { Sport, Session, UserSession } = require("../models");

router.get("/", async (req, res) => {
  try {
    const sports = await Sport.getSports();
    const sessions = await Session.getSessions();
    res.render("./pages/dashboard", {
      sports: sports,
      sessions: sessions,
      user: req.user,
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get("/playerOnlySessions/", async (request, response) => {
  const userId = request.user.id;
  response.render("./pages/playersSessions", {
    user: request.user,
    createdSessions: await Session.getSessionByCreatorId(userId),
    joinedSessions: await UserSession.getUserSessionByUserId(userId),
    csrfToken: request.csrfToken(),
  });
});

module.exports = router;
