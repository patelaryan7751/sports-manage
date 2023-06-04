/* eslint-disable no-undef */
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { User, Session, UserSession } = require("./models");
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.post("/users", async (request, response) => {
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
app.get("/users", async (request, response) => {
  try {
    const users = await User.findAll();
    response.json(users);
  } catch (error) {
    response.status(500).json({ error: error });
  }
});
app.delete("/users/:id", async (request, response) => {
  try {
    const user = await User.findByPk(request.params.id);
    await user.destroy();
    response.json({ message: "User deleted" });
  } catch (error) {
    response.status(500).json({ error: error });
  }
});

app.post("/sessions", async (request, response) => {
  try {
    const session = await Session.create({
      time: request.body.time,
      place: request.body.place,
      numberOfPlayers: request.body.numberOfPlayers,
    });
    response.json(session);
  } catch (error) {
    response.status(500).json({ error: error });
  }
});

app.get("/sessions", async (request, response) => {
  try {
    const sessions = await Session.findAll();
    response.json(sessions);
  } catch (error) {
    response.status(500).json({ error: error });
  }
});

app.post("/usersession", async (request, response) => {
  try {
    const usersession = await UserSession.create({
      userId: request.body.userId,
      sessionId: request.body.sessionId,
    });
    response.json(usersession);
  } catch (error) {
    response.status(500).json({ error: error });
  }
});
app.get("/usersession", async (request, response) => {
  try {
    const usersessions = await UserSession.findAll();
    response.json(usersessions);
  } catch (error) {
    response.status(500).json({ error: error });
  }
});

app.delete("/usersession/:id", async (request, response) => {
  try {
    const usersession = await UserSession.findByPk(request.params.id);
    await usersession.destroy();
    response.json({ message: "UserSession deleted" });
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: error });
  }
});

app.get("/sessionplayers/:id", async (request, response) => {
  try {
    const session = await UserSession.findAll({
      where: { sessionId: request.params.id },
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });

    response.json(session);
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: error });
  }
});

module.exports = app;
