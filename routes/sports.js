/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();
const { Sport } = require("../models");

router.post("/", async (request, response) => {
  try {
    const sport = await Sport.create({
      name: request.body.name,
      creator_id: request.body.creator_id,
    });
    response.json(sport);
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

module.exports = router;
