/* eslint-disable no-undef */
const express = require("express");
const { Op } = require("sequelize");
const router = express.Router();
const { Sport, Session, User } = require("../models");

const requirePublisher = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  } else {
    res.render("./pages/404");
  }
};

router.get("/", requirePublisher, async (request, response) => {
  response.render("./pages/reports", {
    user: request.user,
    csrfToken: request.csrfToken(),
  });
});

router.post("/getData", requirePublisher, async (request, response) => {
  const startDate = request.body.start_time;
  const endDate = request.body.end_time;
  try {
    const sessions = await Session.findAll({
      where: {
        time: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        {
          model: Sport,
          attributes: ["name"],
        },
      ],
    });
    const players = await User.getPlayers();
    const sportCount = sessions.reduce((count, obj) => {
      const sportName = obj.Sport.name;
      count[sportName] = (count[sportName] || 0) + 1;
      return count;
    }, {});

    // Find the maximum count
    const maxCount = Math.max(...Object.values(sportCount));

    // Find the sport(s) with the maximum count
    const mostPlayedSports = Object.keys(sportCount).filter(
      (sport) => sportCount[sport] === maxCount
    );

    console.log("Most played sport(s):", mostPlayedSports);

    response.render("./pages/reportsViewStats", {
      user: request.user,
      sessions: sessions,
      startDate: startDate,
      endDate: endDate,
      players: players,
      mostPlayedSports: mostPlayedSports,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: error });
  }
});

module.exports = router;
