/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();
const passport = require("passport");

router.post(
  "/",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (request, response) => {
    console.log(request.user);
    response.redirect("/dashboard");
  }
);
module.exports = router;
