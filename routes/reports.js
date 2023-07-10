/* eslint-disable no-undef */
const express = require("express");
const { Op } = require("sequelize");
const router = express.Router();
const { Session } = require("../models");

router.get("/", async (request, response) => {
  response.render("./pages/reports", {
    user: request.user,
    csrfToken: request.csrfToken(),
  });
});

router.post("/getData", async (request, response) => {
  const startDate = request.body.start_time;
  const endDate = request.body.end_time;
  try {
    const sessions = await Session.findAll({
      where: {
        time: {
          [Op.between]: [startDate, endDate],
        },
      },
    });
    response.json(sessions);
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: error });
  }
});

module.exports = router;
