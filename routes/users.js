/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();
const { User } = require("../models");

router.post("/", async (request, response) => {
  // Hash the password
  try {
    const user = await User.create({
      name: request.body.name,
      email: request.body.email,
      password: request.body.password,
      role: request.body.role,
    });
    response.json(user);
  } catch (error) {
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
