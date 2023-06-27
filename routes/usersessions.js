/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();
const { UserSession, User, Session } = require("../models");

router.post("/", async (request, response) => {
  try {
    const usersession = await UserSession.create({
      userId: request.body.userId,
      sessionId: request.body.sessionId,
      sport_id: request.body.sport_id,
    });
    response.json(usersession);
  } catch (error) {
    response.status(500).json({ error: error });
  }
});

router.get("/", async (request, response) => {
  try {
    const usersessions = await UserSession.findAll();
    response.json(usersessions);
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: error });
  }
});

router.delete("/:userId/:sessionId", async (request, response) => {
  try {
    await UserSession.playerLeaveSession(
      request.params.userId,
      request.params.sessionId
    );
    const session = await Session.getSessionById(request.params.sessionId);
    const getSessionSlots = session.map((user) => user.toJSON())[0]
      .numberOfPlayers;
    const updatedSessionSlots = Number(getSessionSlots) + 1;
    await Session.update(
      {
        numberOfPlayers: updatedSessionSlots,
      },
      { where: { id: request.params.sessionId } }
    );
    response.json({ message: "Player removed from session" });
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: error });
  }
});

router.post("/:sportId/:userId/:sessionId", async (request, response) => {
  try {
    await UserSession.addPlayerToSession(
      request.params.userId,
      request.params.sessionId,
      request.params.sportId
    );
    const session = await Session.getSessionById(request.params.sessionId);
    const getSessionSlots = session.map((user) => user.toJSON())[0]
      .numberOfPlayers;
    const updatedSessionSlots = Number(getSessionSlots) - 1;
    await Session.update(
      {
        numberOfPlayers: updatedSessionSlots,
      },
      { where: { id: request.params.sessionId } }
    );
    response.json({ message: "Player added to session" });
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: error });
  }
});

router.get("/sessionplayers/:id", async (request, response) => {
  try {
    const session = await UserSession.findAll({
      where: { sessionId: request.params.id },
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });

    response.json(session);
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: error });
  }
});

module.exports = router;
