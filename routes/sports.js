/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();
const { Sport, Session, User } = require("../models");

// all operations on sports

const requirePublisher = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  } else {
    res.status(401).json({ message: "Unauthorized user." });
  }
};

router.post("/", requirePublisher, async (request, response) => {
  try {
    await Sport.createNewSport(request.body.name, request.user.id);
    return response.redirect("/dashboard");
  } catch (error) {
    response.status(500).json({ error: error });
  }
});

router.get("/", async (request, response) => {
  try {
    const sports = await Sport.getSports();
    response.json({ sports });
  } catch (error) {
    response.status(500).json({ error: error });
  }
});

router.delete("/:id", requirePublisher, async (request, response) => {
  try {
    await Sport.removeSport(request.params.id);
    response.json({ message: "Sport deleted" });
  } catch (error) {
    response.status(500).json({ error: error });
  }
});

// all operations on sports views
router.get("/create", requirePublisher, async (request, response) => {
  response.render("./pages/sportsCreate.ejs", {
    csrfToken: request.csrfToken(),
    user: request.user,
  });
});

router.get("/:id/session/create", async (request, response) => {
  const players = await User.getPlayers();
  response.render("./pages/sessionsCreate.ejs", {
    csrfToken: request.csrfToken(),
    sportId: request.params.id,
    players: players,
    user: request.user,
  });
});

router.get("/:id", async (request, response) => {
  try {
    const sport = await Sport.findByPk(request.params.id);
    const sessions = await Session.getSessionBySportId(request.params.id);
    const user = request.user;
    response.render("./pages/sportsView.ejs", {
      sport: sport,
      sessions: sessions,
      user: user,
    });
  } catch (error) {
    response.status(500).json({ error: error });
  }
});

module.exports = router;
