/* eslint-disable no-undef */
const request = require("supertest");
const cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");

let server, agent;
function extractCSRFToken(res) {
  let $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}

const login = async (agent, username, password) => {
  let res = await agent.get("/login");
  let csrfToken = extractCSRFToken(res);
  res = await agent.post("/loginSession").send({
    email: username,
    password: password,
    _csrf: csrfToken,
  });
};

describe("Todo Application", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(4000, () => {});
    agent = request.agent(server);
    // add players to the database
    let res = await agent.get("/signup");
    let csrfToken = extractCSRFToken(res);
    await agent.post("/users").send({
      name: "Player1",
      email: "player1@gmail.com",
      password: "123456",
      role: "player",
      _csrf: csrfToken,
    });
    await agent.get("/signout");
    res = await agent.get("/signup");
    csrfToken = extractCSRFToken(res);
    await agent.post("/users").send({
      name: "Player2",
      email: "player2@gmail.com",
      password: "123456",
      role: "player",
      _csrf: csrfToken,
    });
    await agent.get("/signout");
    res = await agent.get("/signup");
    csrfToken = extractCSRFToken(res);
    await agent.post("/users").send({
      name: "Player3",
      email: "player3@gmail.com",
      password: "123456",
      role: "player",
      _csrf: csrfToken,
    });
    await agent.get("/signout");
  });
  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });

  test("Sign up", async () => {
    let res = await agent.get("/signup");
    const csrfToken = extractCSRFToken(res);
    res = await agent.post("/users").send({
      name: "Admin",
      email: "admin@gmail.com",
      password: "123456",
      role: "admin",
      _csrf: csrfToken,
    });
    expect(res.statusCode).toBe(302);
  });
  test("Sign out", async () => {
    let res = await agent.get("/dashboard");
    expect(res.statusCode).toBe(200);
    res = await agent.get("/signout");
    expect(res.statusCode).toBe(302);
    res = await agent.get("/dashboard");
    expect(res.statusCode).toBe(302);
  });
  test("Create a new sport", async () => {
    const agent = request.agent(server);
    await login(agent, "admin@gmail.com", "123456");
    const res = await agent.get("/sports/create");
    const csrfToken = extractCSRFToken(res);
    const response = await agent.post("/sports").send({
      name: "Football Test",
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302);
  });
  test("Create a new session", async () => {
    const agent = request.agent(server);
    await login(agent, "admin@gmail.com", "123456");
    let res = await agent.get("/sports/create");
    let csrfToken = extractCSRFToken(res);
    await agent.post("/sports").send({
      name: "Cricket Test",
      _csrf: csrfToken,
    });
    const groupedSportsResponse = await agent
      .get("/sports")
      .set("Accept", "application/json");
    let parsedGroupedResponse = JSON.parse(groupedSportsResponse.text);
    parsedGroupedResponse = parsedGroupedResponse.sports;
    const sportsCount = parsedGroupedResponse.length;
    const latestSports = parsedGroupedResponse[sportsCount - 1];
    const sportId = latestSports.id;
    const groupedPlayersResponse = await agent
      .get("/users/players")
      .set("Accept", "application/json");
    let parsedGroupedPlayersResponse = JSON.parse(groupedPlayersResponse.text);
    const playersCount = parsedGroupedPlayersResponse.length;
    const selectedPlayersId = parsedGroupedPlayersResponse
      .map((player) => player.id)
      .slice(0, playersCount)
      .join(",");
    res = await agent.get(`/sports/${sportId}/session/create`);
    csrfToken = extractCSRFToken(res);
    const response = await agent.post(`/sessions`).send({
      time: new Date().toISOString(),
      place: "Test Place",
      numberOfPlayers: 3,
      sport_id: sportId,
      selectedPlayersId: selectedPlayersId,
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302);
  });
});
