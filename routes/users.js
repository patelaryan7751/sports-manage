/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();
const { User } = require("../models");
const bcrypt = require("bcrypt");
const saltRounds = 10;

router.post("/", async (request, response) => {
  try {
    const existingUser = await User.findOne({
      where: { email: request.body.email },
    });
    const isPasswordSixLettered = request.body.password.length >= 6;
    if (existingUser) {
      return response.status(400).json({ error: "Email already exists" });
    }
    if (!isPasswordSixLettered) {
      return response
        .status(400)
        .json({ error: "Password should be 6 characters long" });
    }
    const hashedPassword = await bcrypt.hash(request.body.password, saltRounds);
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

router.get("/players", async (request, response) => {
  try {
    const users = await User.getPlayers();
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
