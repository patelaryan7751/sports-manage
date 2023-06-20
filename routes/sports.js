/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();
const { Sport, Session } = require("../models");

// all operations on sports

router.post("/", async (request, response) => {
  try {
    await Sport.create({
      name: request.body.name,
      creator_id: request.body.creator_id,
    });
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

router.delete("/:id", async (request, response) => {
  try {
    const sport = await Sport.findByPk(request.params.id);
    await sport.destroy();
    response.json({ message: "Sport deleted" });
  } catch (error) {
    response.status(500).json({ error: error });
  }
});

// all operations on sports views
router.get("/create", async (request, response) => {
  response.render("./pages/sportsCreate.ejs", {
    csrfToken: request.csrfToken(),
  });
});

router.get("/:id", async (request, response) => {
  try {
    const sport = await Sport.findByPk(request.params.id);
    const sessions = await Session.getSessionBySportId(request.params.id);
    response.render("./pages/sportsView.ejs", {
      sport: sport,
      sessions: sessions,
    });
  } catch (error) {
    response.status(500).json({ error: error });
  }
});

module.exports = router;
