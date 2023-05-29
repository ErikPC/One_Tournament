const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

require("dotenv").config();

const Jugador = require("../models/jugador");
const jugadorPost = require("../db/jugadores/jugadorPost.json");
const jugadorUpdate = require("../db/jugadores/jugadorUpdate.json");
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
  await Jugador.deleteMany({});
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe("test jugador", () => {
  test("register jugador", async () => {
    const response = await request(app)
      .post("/api/jugador")
      .set("Authorization", `${token}`)
      .send(jugadorPost);
    expect(response.statusCode).toBe(201);
  });

  test("register jugador err 500", async () => {
    // mockea un error para entrar en el catch
    jest.spyOn(repository, "createJugador").mockImplementation(() => {
      throw new Error("Error en createJugador");
    });

    const response = await request(app)
      .post("/api/jugador")
      .set("Authorization", `${token}`)
      .send(jugadorPost);
    expect(response.statusCode).toBe(500);

    // restaura el mock para que no afecte a otros posibles tests
    repository.createJugador.mockRestore();
  });
  test("register jugador fail without token", async () => {
    const response = await request(app).post("/api/jugador").send(jugadorPost);
    expect(response.statusCode).toBe(403);
  });

  test("get jugador", async () => {
    const response = await request(app)
      .get("/api/jugador")
      .set("Authorization", `${token}`);
    expect(response.statusCode).toBe(200);
  });

  test("get jugadores err 500", async () => {
    jest.spyOn(repository, "getJugadores").mockImplementation(() => {
      throw new Error("Error en getJugadores");
    });

    const response = await request(app)
      .get("/api/jugador")
      .set("Authorization", `${token}`);
    expect(response.statusCode).toBe(500);

    repository.getJugadores.mockRestore();
  });

  test("get jugador fail without token", async () => {
    const response = await request(app).get("/api/jugador");
    expect(response.statusCode).toBe(403);
  });

  test("get jugador by name", async () => {
    const response = await request(app)
      .get("/api/jugador/Falopio")
      .set("Authorization", `${token}`);
    expect(response.statusCode).toBe(200);
  });

  test("get jugador by name fail without token", async () => {
    const response = await request(app).get("/api/jugador/Pepe");
    expect(response.statusCode).toBe(403);
  });

  test("update jugador", async () => {
    const response = await request(app)
      .put("/api/jugador/Falopio")
      .set("Authorization", `${token}`)
      .send(jugadorUpdate);
    expect(response.statusCode).toBe(200);
  });

  test("update jugador fail without token", async () => {
    const response = await request(app)
      .put("/api/jugador/Pepe")
      .send(jugadorUpdate);
    expect(response.statusCode).toBe(403);
  });

  test("delete jugador", async () => {
    const response = await request(app)
      .delete("/api/jugador/Falopio")
      .set("Authorization", `${token}`);
    expect(response.statusCode).toBe(200);
  });

  test("delete jugador err 404", async () => {
    const response = await request(app)
      .delete("/api/jugador/Fnandu")
      .set("Authorization", `${token}`);
    expect(response.statusCode).toBe(404);
  });

  test("delete jugador err 500", async () => {
    jest.spyOn(repository, "deleteJugador").mockImplementation(() => {
      throw new Error("Error en deleteJugador");
    });

    const response = await request(app)
      .delete("/api/jugador/Falopio")
      .set("Authorization", `${token}`);
    expect(response.statusCode).toBe(500);

    repository.deleteJugador.mockRestore();
  });

  test("delete jugador fail without token", async () => {
    const response = await request(app).delete("/api/jugador/Falopio");
    expect(response.statusCode).toBe(403);
  });
});
