/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();
const { Session } = require("../models");

router.post("/", async (request, response) => {
  try {
    const session = await Session.create({
      time: request.body.time,
      place: request.body.place,
      numberOfPlayers: request.body.numberOfPlayers,
      creator_id: request.body.creator_id,
    });
    response.json(session);
  } catch (error) {
    response.status(500).json({ error: error });
  }
});

router.get("/", async (request, response) => {
  try {
    const sessions = await Session.findAll();
    response.json(sessions);
  } catch (error) {
    response.status(500).json({ error: error });
  }
});

module.exports = router;
