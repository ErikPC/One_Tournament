const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

const User = require("../models/user");
const userPost = require("../db/user/userPost.json");

require("dotenv").config();

const uri = process.env.MONGO_URI_TEST;

jest.setTimeout(10000);

beforeAll(async () => {
  mongoose.set("strictQuery", false);
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe("test user auth", () => {
  test("register user", async () => {
    const response = await request(app).post("/api/register").send(userPost);
    expect(response.statusCode).toBe(201);
  });

  let token;

  test("login user", async () => {
    const response = await request(app).post("/api/login").send(userPost);
    expect(response.statusCode).toBe(200);
    console.log(response.body);
    token = response.body.token;
  });

  test("login user with wrong password", async () => {
    const response = await request(app)
      .post("/api/login")
      .send({ email: userPost.email, password: "wrongPassword" });
    expect(response.statusCode).toBe(500);
  });

  test("login user with wrong email", async () => {
    const response = await request(app)
      .post("/api/login")
      .send({ email: "wrongEmail", password: userPost.password });
    expect(response.statusCode).toBe(500);
  });

  test("protected route fail", async () => {
    const response = await request(app).get("/api/protected");
    expect(response.statusCode).toBe(403);
  });

  test("protected route success", async () => {
    console.log(token);
    const response = await request(app)
      .get("/api/protected")
      .set("Authorization", `${token}`);
    expect(response.statusCode).toBe(200);
  });
});
