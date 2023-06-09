/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();
const { UserSession, User } = require("../models");

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

router.delete("/:id", async (request, response) => {
  try {
    const usersession = await UserSession.findByPk(request.params.id);
    await usersession.destroy();
    response.json({ message: "UserSession deleted" });
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
