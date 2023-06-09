/* eslint-disable no-undef */
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const usersRoutes = require("./routes/users");
const sportsRoutes = require("./routes/sports");
const sessionsRoutes = require("./routes/sessions");
const userSessionsRoutes = require("./routes/usersessions");
const dashboardRoutes = require("./routes/dashboard");
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.use("/users", usersRoutes);
app.use("/sports", sportsRoutes);
app.use("/sessions", sessionsRoutes);
app.use("/usersessions", userSessionsRoutes);
app.use("/dashboard", dashboardRoutes);

module.exports = app;
