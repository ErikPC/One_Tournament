const emparejamiento = require("../domain/emparejamiento");
const mongoose = require("mongoose");

require("dotenv").config();

const jugadoresEmparejamiento = require("../db/emparejamiento/jugadoresEmparejamiento.json");
const torneo = require("../db/emparejamiento/torneoEmparejamiento.json");
const Jugador = require("../models/jugador");

const uri = process.env.MONGO_URI_TEST;
jest.setTimeout(10000);

beforeAll(async () => {
  mongoose.set("strictQuery", false);
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await Jugador.insertMany(jugadoresEmparejamiento);
});

afterAll(async () => {
  await Jugador.deleteMany({});
  await mongoose.connection.close();
});
describe("Emparejamiento", () => {
  test("getListaJugadores", async () => {
    const listaJugadores = await emparejamiento.getListaJugadores(torneo);
    expect(listaJugadores).not.toBeNull();
    expect(listaJugadores.length).toBe(5);
  });

  test("getListaJugadores - torneo null", async () => {
    const listaJugadores = await emparejamiento.getListaJugadores(null);
    expect(listaJugadores).toBeNull();
  });
});
