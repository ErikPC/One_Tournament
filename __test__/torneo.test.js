const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

require("dotenv").config();

const Torneo = require("../models/torneo");
const torneoPost = require("../db/torneo/torneoPost.json");
const torneoUpdate = require("../db/torneo/torneoUpdate.json");
const User = require("../models/user");
const userPost = require("../db/user/userPost.json");

const uri = process.env.MONGO_URI_TEST;
jest.setTimeout(10000);

let token = "";
beforeAll(async () => {
  mongoose.set("strictQuery", false);
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await request(app).post("/api/register").send(userPost);
  const response = await request(app).post("/api/login").send(userPost);
  token = response.body.token;
});

afterAll(async () => {
  await Torneo.deleteMany({});
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe("test torneo", () => {
  test("register torneo", async () => {
    const response = await request(app)
      .post("/api/torneo")
      .set("Authorization", `${token}`)
      .send(torneoPost);
    expect(response.statusCode).toBe(200);
  });

  test("register torneo fail without token", async () => {
    const response = await request(app).post("/api/torneo").send(torneoPost);
    expect(response.statusCode).toBe(403);
  });

  test("get torneo", async () => {
    const response = await request(app)
      .get("/api/torneo")
      .set("Authorization", `${token}`);
    expect(response.statusCode).toBe(200);
  });

  test("get torneo fail without token", async () => {
    const response = await request(app).get("/api/torneo");
    expect(response.statusCode).toBe(403);
  });

  test("get torneo ", async () => {
    const response = await request(app)
      .get("/api/torneo/01-01-02/Neverwinter")
      .set("Authorization", `${token}`);
    expect(response.statusCode).toBe(200);
  });

  test("get torneo fail without token", async () => {
    const response = await request(app).get("/api/torneo/01-01-02/Neverwinter");
    expect(response.statusCode).toBe(403);
  });

  test("update torneo", async () => {
    const response = await request(app)
      .put("/api/torneo/01-01-02/Neverwinter")
      .set("Authorization", `${token}`)
      .send(torneoUpdate);
    expect(response.statusCode).toBe(200);
  });

  test("update torneo fail without token", async () => {
    const response = await request(app)
      .put("/api/torneo/01-01-01/Neverwinter")
      .send(torneoUpdate);
    expect(response.statusCode).toBe(403);
  });

  test("delete torneo", async () => {
    const response = await request(app)
      .delete("/api/torneo/01-01-01/Neverwinter")
      .set("Authorization", `${token}`)
      .send(torneoUpdate);
    expect(response.statusCode).toBe(200);
  });

  test("delete torneo fail without token", async () => {
    const response = await request(app)
      .delete("/api/torneo/01-01-01/Neverwinter")
      .send(torneoUpdate);
    expect(response.statusCode).toBe(403);
  });
});
