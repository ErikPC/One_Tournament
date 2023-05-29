const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

require("dotenv").config();

const Torneo = require("../models/torneo");
const torneoPost = require("../db/torneo/torneoPost.json");
const torneoUpdate = require("../db/torneo/torneoUpdate.json");
const torneoCompleto = require("../db/torneo/torneoCompleto.json");
const torneoJugadorExiste = require("../db/torneo/torneoJugadorExiste.json");
const torneoFinalizado = require("../db/torneo/torneoFinalizado.json");
const User = require("../models/user");
const userPost = require("../db/user/userPost.json");
const repository = require("../repository/repositoryTorneo");

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

  test("register torneo err 500", async () => {
    jest.spyOn(repository, "createTorneo").mockImplementation(() => {
      throw new Error("Error en createTorneo");
    });

    const response = await request(app)
      .post("/api/torneo")
      .set("Authorization", `${token}`)
      .send(torneoPost);
    expect(response.statusCode).toBe(500);

    repository.createTorneo.mockRestore();
  });

  test("register torneo err 400", async () => {
    jest.spyOn(repository, "createTorneo").mockImplementation(() => null);

    const response = await request(app)
      .post("/api/torneo")
      .set("Authorization", `${token}`);

    expect(response.statusCode).toBe(400);

    repository.createTorneo.mockRestore();
  });

  test("register torneo fail without token", async () => {
    const response = await request(app).post("/api/torneo").send(torneoPost);
    expect(response.statusCode).toBe(403);
  });

  test("get torneos", async () => {
    const response = await request(app)
      .get("/api/torneo")
      .set("Authorization", `${token}`);
    expect(response.statusCode).toBe(200);
  });

  test("get torneos err 500", async () => {
    jest.spyOn(repository, "getTorneos").mockImplementation(() => {
      throw new Error("Error en getTorneos");
    });

    const response = await request(app)
      .get("/api/torneo")
      .set("Authorization", `${token}`);
    expect(response.statusCode).toBe(500);

    repository.getTorneos.mockRestore();
  });

  test("get torneos fail without token", async () => {
    const response = await request(app).get("/api/torneo");
    expect(response.statusCode).toBe(403);
  });

  test("get torneo ", async () => {
    const response = await request(app)
      .get("/api/torneo/01-01-02/Neverwinter")
      .set("Authorization", `${token}`);
    expect(response.statusCode).toBe(200);
  });

  test("get torneo err 500", async () => {
    jest.spyOn(repository, "getTorneo").mockImplementation(() => {
      throw new Error("Error en getTorneo");
    });

    const response = await request(app)
      .get("/api/torneo/01-01-02/Neverwinter")
      .set("Authorization", `${token}`);
    expect(response.statusCode).toBe(500);

    repository.getTorneo.mockRestore();
  });

  test("get torneo err 404", async () => {
    const response = await request(app)
      .get("/api/torneo/01-01-02/Ludicon")
      .set("Authorization", `${token}`);
    expect(response.statusCode).toBe(404);
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

  test("update torneo err 500", async () => {
    jest.spyOn(repository, "updateTorneo").mockImplementation(() => {
      throw new Error("Error en updateTorneo");
    });

    const response = await request(app)
      .put("/api/torneo/01-01-02/Neverwinter")
      .set("Authorization", `${token}`)
      .send(torneoUpdate);
    expect(response.statusCode).toBe(500);

    repository.updateTorneo.mockRestore();
  });

  test("update torneo err 404", async () => {
    const response = await request(app)
      .put("/api/torneo/01-01-02/Ludicon")
      .set("Authorization", `${token}`)
      .send(torneoUpdate);
    expect(response.statusCode).toBe(404);
  });

  test("update torneo fail without token", async () => {
    const response = await request(app)
      .put("/api/torneo/01-01-01/Neverwinter")
      .send(torneoUpdate);
    expect(response.statusCode).toBe(403);
  });

  test("Añadir participante", async () => {
    const response = await request(app)
      .put("/api/torneo/01-01-01/Neverwinter/anadir/Falopio")
      .set("Authorization", `${token}`);
    expect(response.statusCode).toBe(200);
  });

  test("AñadirParticipante torneo lleno", async () => {
    await request(app)
      .post("/api/torneo")
      .set("Authorization", `${token}`)
      .send(torneoCompleto);
    const response = await request(app)
      .put("/api/torneo/01-01-03/Neverwinter/anadir/Falopio")
      .set("Authorization", `${token}`);
    expect(response.statusCode).toBe(400);
  });

  test("Añadir participante ya existe", async () => {
    await request(app)
      .post("/api/torneo")
      .set("Authorization", `${token}`)
      .send(torneoJugadorExiste);
    const response = await request(app)
      .put("/api/torneo/01-01-04/Neverwinter/anadir/Falopio")
      .set("Authorization", `${token}`);
    expect(response.statusCode).toBe(400);
  });

  test("Añadir participante torneo finalizado", async () => {
    await request(app)
      .post("/api/torneo")
      .set("Authorization", `${token}`)
      .send(torneoFinalizado);
    const response = await request(app)
      .put("/api/torneo/01-01-05/Neverwinter/anadir/Falopio")
      .set("Authorization", `${token}`);
    expect(response.statusCode).toBe(400);
  });

  test("Añadir participante err 404", async () => {
    const response = await request(app)
      .put("/api/torneo/01-01-02/Ludicon/anadir/Falopio")
      .set("Authorization", `${token}`);
    expect(response.statusCode).toBe(404);
  });

  test("Añadir participante err 500", async () => {
    jest.spyOn(repository, "getTorneo").mockImplementation(() => {
      throw new Error("Error en anadirParticipante");
    });

    const response = await request(app)
      .put("/api/torneo/01-01-02/Neverwinter/anadir/Falopio")
      .set("Authorization", `${token}`);
    expect(response.statusCode).toBe(500);

    repository.getTorneo.mockRestore();
  });

  test("Eliminar participante", async () => {
    const response = await request(app)
      .put("/api/torneo/01-01-01/Neverwinter/eliminar/Falopio")
      .set("Authorization", `${token}`);
    expect(response.statusCode).toBe(200);
  });
  test("Eliminar participante torneo finalizado", async () => {
    const response = await request(app)
      .put("/api/torneo/01-01-05/Neverwinter/eliminar/Falopio")
      .set("Authorization", `${token}`);
    expect(response.statusCode).toBe(400);
  });

  test("Eliminar participante err 404", async () => {
    const response = await request(app)
      .put("/api/torneo/01-01-02/Ludicon/eliminar/Falopio")
      .set("Authorization", `${token}`);
    expect(response.statusCode).toBe(404);
  });

  test("Eliminar participante err 500", async () => {
    jest.spyOn(repository, "getTorneo").mockImplementation(() => {
      throw new Error("Error en eliminarParticipante");
    });

    const response = await request(app)
      .put("/api/torneo/01-01-02/Neverwinter/eliminar/Falopio")
      .set("Authorization", `${token}`);
    expect(response.statusCode).toBe(500);

    repository.getTorneo.mockRestore();
  });

  test("getListajugadores", async () => {
    const response = await request(app)
      .get("/api/torneo/01-01-01/Neverwinter/jugadores")
      .set("Authorization", `${token}`);
    expect(response.statusCode).toBe(200);
  });

  test("getListajugadores err 404", async () => {
    const response = await request(app)
      .get("/api/torneo/01-01-02/Ludicon/jugadores")
      .set("Authorization", `${token}`);
    expect(response.statusCode).toBe(404);
  });

  test("getListajugadores err 500", async () => {
    jest.spyOn(repository, "getTorneo").mockImplementation(() => {
      throw new Error("Error en getListaJugadores");
    });

    const response = await request(app)
      .get("/api/torneo/01-01-02/Neverwinter/jugadores")
      .set("Authorization", `${token}`);
    expect(response.statusCode).toBe(500);

    repository.getTorneo.mockRestore();
  });

  test("delete torneo", async () => {
    const response = await request(app)
      .delete("/api/torneo/01-01-01/Neverwinter")
      .set("Authorization", `${token}`)
      .send(torneoUpdate);
    expect(response.statusCode).toBe(200);
  });

  test("delete torneo err 500", async () => {
    jest.spyOn(repository, "deleteTorneo").mockImplementation(() => {
      throw new Error("Error en deleteTorneo");
    });

    const response = await request(app)
      .delete("/api/torneo/01-01-01/Neverwinter")
      .set("Authorization", `${token}`)
      .send(torneoUpdate);
    expect(response.statusCode).toBe(500);

    repository.deleteTorneo.mockRestore();
  });

  test("delete torneo err 404", async () => {
    const response = await request(app)
      .delete("/api/torneo/01-01-01/Ludicon")
      .set("Authorization", `${token}`)
      .send(torneoUpdate);
    expect(response.statusCode).toBe(404);
  });

  test("delete torneo fail without token", async () => {
    const response = await request(app)
      .delete("/api/torneo/01-01-01/Neverwinter")
      .send(torneoUpdate);
    expect(response.statusCode).toBe(403);
  });
});
