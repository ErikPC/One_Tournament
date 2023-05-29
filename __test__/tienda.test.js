const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

const Tienda = require("../models/tienda");
const User = require("../models/user");
const tiendaPost = require("../db/tienda/tiendaPost.json");
const tiendaUpdate = require("../db/tienda/tiendaUpdate.json");
const userPost = require("../db/user/userPost.json");
const repository = require("../repository/repositoryTienda");

require("dotenv").config();

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
  await Tienda.deleteMany({});
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe("test tienda", () => {
  test("register tienda", async () => {
    const response = await request(app)
      .post("/api/tienda")
      .set("Authorization", `${token}`)
      .send(tiendaPost);
    expect(response.statusCode).toBe(201);
  });

  test("createTienda err 500", async () => {
    // Mockea un error para entrar en el catch
    jest.spyOn(repository, "createTienda").mockImplementation(() => {
      throw new Error("Error en createTienda");
    });

    const response = await request(app)
      .post("/api/tienda")
      .set("Authorization", `${token}`)
      .send(tiendaPost);
    expect(response.statusCode).toBe(500);

    // Restaura el mock para que no afecte a otros posibles tests
    repository.createTienda.mockRestore();
  });

  test("register tienda fail without token", async () => {
    const response = await request(app).post("/api/tienda").send(tiendaPost);
    expect(response.statusCode).toBe(403);
  });

  test("get tienda", async () => {
    const response = await request(app)
      .get("/api/tienda")
      .set("Authorization", `${token}`);
    expect(response.statusCode).toBe(200);
  });

  test("get tienda err 500", async () => {
    jest.spyOn(repository, "getTiendas").mockImplementation(() => {
      throw new Error("Error en getTiendas");
    });

    const response = await request(app)
      .get("/api/tienda")
      .set("Authorization", `${token}`);
    expect(response.statusCode).toBe(500);

    repository.getTiendas.mockRestore();
  });

  test("get tienda fail without token", async () => {
    const response = await request(app).get("/api/tienda");
    expect(response.statusCode).toBe(403);
  });

  test("get tienda by name", async () => {
    const response = await request(app)
      .get("/api/tienda/Neverwinter")
      .set("Authorization", `${token}`);
    expect(response.statusCode).toBe(200);
  });

  test("get tienda by name fail without token", async () => {
    const response = await request(app).get("/api/tienda/Neverwinter");
    expect(response.statusCode).toBe(403);
  });

  test("update tienda", async () => {
    const response = await request(app)
      .put("/api/tienda/Neverwinter")
      .set("Authorization", `${token}`)
      .send(tiendaUpdate);
    expect(response.statusCode).toBe(200);
  });

  test("update tienda fail without token", async () => {
    const response = await request(app)
      .put("/api/tienda/Neverwinter")
      .send(tiendaUpdate);
    expect(response.statusCode).toBe(403);
  });

  test("delete tienda", async () => {
    const response = await request(app)
      .delete("/api/tienda/Neverwinter")
      .set("Authorization", `${token}`);
    expect(response.statusCode).toBe(200);
  });

  test("delete tienda fail without token", async () => {
    const response = await request(app).delete("/api/tienda/Neverwinter");
    expect(response.statusCode).toBe(403);
  });
});
