/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();
const { Sport, UserSession } = require("../models");

// router.post("/", async (request, response) => {
//   try {
//     const sport = await Sport.create({
//       name: request.body.name,
//       creator_id: request.body.creator_id,
//     });
//     response.json(sport);
//   } catch (error) {
//     response.status(500).json({ error: error });
//   }
// });

router.get("/", async (req, res) => {
  try {
    const sports = await Sport.getSports();
    const userSessions = await UserSession.getUserSessions();
    if (req.accepts("html")) {
      res.render("./pages/dashboard", {
        sports: sports,
        userSessions: userSessions,
      });
    } else {
      res.json({ sports });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
