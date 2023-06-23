/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("./pages/profile", { user: req.user });
});
module.exports = router;
