/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();
const { Sport, Session } = require("../models");

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

module.exports = router;
