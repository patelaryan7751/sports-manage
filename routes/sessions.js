/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();
const { Session, UserSession, Sport, User } = require("../models");

router.post("/", async (request, response) => {
  const selectedPlayers = request.body.selectedPlayersId.split(",");
  if (request.body.selectedPlayersId === "") {
    request.flash("error", "Please select at least one player");
    return response.redirect(`/sports/${request.body.sport_id}/session/create`);
  }
  if (request.body.time.trim() === "") {
    request.flash("error", "Time cannot be empty");
    return response.redirect(`/sports/${request.body.sport_id}/session/create`);
  }
  if (request.body.place.trim() === "") {
    request.flash("error", "Place cannot be empty");
    return response.redirect(`/sports/${request.body.sport_id}/session/create`);
  }
  if (Number(request.body.numberOfPlayers) < 0) {
    request.flash("error", "Number of players cannot be negative");
    return response.redirect(`/sports/${request.body.sport_id}/session/create`);
  }

  selectedPlayers.push(request.user.id);
  try {
    const session = await Session.create({
      time: request.body.time,
      place: request.body.place,
      numberOfPlayers: request.body.numberOfPlayers,
      creator_id: request.user.id,
      sport_id: request.body.sport_id,
      isCancelled: false,
      cancelReason: "",
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
      csrfToken: request.csrfToken(),
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: error });
  }
});
router.post("/:id/", async (request, response) => {
  try {
    if (request.body.cancelReason.trim() === "") {
      request.flash("error", "Reason cannot be empty");
      return response.redirect(`/sessions/${request.params.id}/cancel`);
    }
    await Session.update(
      {
        isCancelled: true,
        cancelReason: request.body.cancelReason.trim(),
      },
      { where: { id: request.params.id } }
    );
    response.redirect(`/sessions/${request.params.id}`);
  } catch (error) {
    response.status(500).json({ error: error });
  }
});
router.get("/:id/cancel", async (request, response) => {
  response.render("./pages/cancelSession.ejs", {
    sessionId: request.params.id,
    csrfToken: request.csrfToken(),
    user: request.user,
  });
});

module.exports = router;
