/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();
const { User } = require("../models");
const bcrypt = require("bcrypt");
const saltRounds = 10;

router.post("/", async (request, response) => {
  const hashedPassword = await bcrypt.hash(request.body.password, saltRounds);
  try {
    const user = await User.create({
      name: request.body.name,
      email: request.body.email,
      password: hashedPassword,
      role: request.body.role,
    });
    request.logIn(user, (err) => {
      if (err) {
        console.log(err);
      }
      response.redirect("/dashboard");
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: error });
  }
});

router.get("/", async (request, response) => {
  try {
    const users = await User.findAll();
    response.json(users);
  } catch (error) {
    response.status(500).json({ error: error });
  }
});

router.delete("/:id", async (request, response) => {
  try {
    const user = await User.findByPk(request.params.id);
    await user.destroy();
    response.json({ message: "User deleted" });
  } catch (error) {
    response.status(500).json({ error: error });
  }
});

module.exports = router;
