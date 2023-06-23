/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();

router.get("/", async (request, response) => {
  response.render("./pages/loginPage.ejs", {
    csrfToken: request.csrfToken(),
  });
});
module.exports = router;
