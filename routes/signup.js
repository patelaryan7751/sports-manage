/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("./pages/signUpPage", { csrfToken: req.csrfToken() });
});
module.exports = router;
