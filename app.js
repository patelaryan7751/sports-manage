/* eslint-disable no-undef */
const express = require("express");
const csrf = require("tiny-csrf");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const { User } = require("./models");
const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const usersRoutes = require("./routes/users");
const sportsRoutes = require("./routes/sports");
const sessionsRoutes = require("./routes/sessions");
const userSessionsRoutes = require("./routes/usersessions");
const dashboardRoutes = require("./routes/dashboard");
const loginRoutes = require("./routes/login");
const loginSessionsRoutes = require("./routes/loginSession");
const signupRoutes = require("./routes/signup");
const profileRoutes = require("./routes/profile");
const sigoutRoutes = require("./routes/signout");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("shh! some secret string"));
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use(
  session({
    secret: "my-super-secret-key-21728172615261562",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, //24hrs
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (userName, password, done) => {
      User.findOne({ where: { email: userName } })
        .then(async (user) => {
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          } else {
            return done("Invalid password.");
          }
        })
        .catch((err) => {
          return done(err);
        });
    }
  )
);
passport.serializeUser((user, done) => {
  console.log("serializing user in session", user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      console.log("deserializing user in session", user.id);
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
});

const ensureNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    // User is authenticated, redirect to "/dashboard" or any other appropriate page
    return res.redirect("/dashboard");
  }
  // User is not authenticated, continue to the next middleware
  return next();
};

app.get("/", ensureNotAuthenticated, (req, res) => {
  res.render("index");
});

app.use("/users", usersRoutes);
app.use("/sports", connectEnsureLogin.ensureLoggedIn(), sportsRoutes);
app.use("/sessions", connectEnsureLogin.ensureLoggedIn(), sessionsRoutes);
app.use("/usersessions", userSessionsRoutes);
app.use("/dashboard", connectEnsureLogin.ensureLoggedIn(), dashboardRoutes);
app.use("/login", ensureNotAuthenticated, loginRoutes);
app.use("/loginSession", loginSessionsRoutes);
app.use("/signup", ensureNotAuthenticated, signupRoutes);
app.use("/signout", sigoutRoutes);
app.use("/profile", connectEnsureLogin.ensureLoggedIn(), profileRoutes);
module.exports = app;
