/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();
const { Session, UserSession, Sport, User } = require("../models");

router.post("/", async (request, response) => {
  const selectedPlayers = request.body.selectedPlayersId.split(",");
  selectedPlayers.push(request.user.id);
  try {
    const session = await Session.create({
      time: request.body.time,
      place: request.body.place,
      numberOfPlayers: request.body.numberOfPlayers,
      creator_id: request.user.id,
      sport_id: request.body.sport_id,
    });
    console.log(session);
    selectedPlayers.map(async (playerId) => {
      await UserSession.addPlayerToSession(
        playerId,
        session.id,
        request.body.sport_id
      );
    });
    response.redirect(`/sports/${request.body.sport_id}`);
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

router.get("/:id", async (request, response) => {
  try {
    const session = await Session.findAll({
      where: { id: request.params.id },
      include: [
        {
          model: Sport,
          attributes: ["name"],
        },
      ],
    });
    const players = await UserSession.findAll({
      where: { sessionId: request.params.id },
      include: [
        {
          model: User,
          attributes: ["name", "id", "role"],
        },
      ],
    });
    response.render("./pages/sessionsView.ejs", {
      sport: session[0].Sport,
      session: session[0],
      players: players,
      user: request.user,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: error });
  }
});

module.exports = router;
