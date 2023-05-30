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

  test("emparejar impares", async () => {
    const listaJugadores = await emparejamiento.getListaJugadores(torneo);
    const parejas = await emparejamiento.emparejar(listaJugadores);
    expect(parejas).not.toBeNull();
    expect(parejas.length).toBe(3);
    expect(parejas[0]).toHaveProperty("jugador1.nombre");
    expect(parejas[0]).toHaveProperty("jugador2.nombre");
    expect(parejas[2]).toHaveProperty("jugador1.bye", true);
  });

  test("actualizarPairing resultado D", async () => {
    const liam = await Jugador.findOne({ nombre: "Liam" });
    const sophia = await Jugador.findOne({ nombre: "Sophia" });
    expect(liam.pairing).toBe(0);
    expect(sophia.pairing).toBe(0);
    await emparejamiento.actualizarPairing(sophia, liam);
    expect(sophia.pairing).toBe(1);
    expect(liam.pairing).toBe(1);
  });

  test("acualizar pairing mismoPuntos igual", async () => {
    const noah = await Jugador.findOne({ nombre: "Noah" });
    const ava = await Jugador.findOne({ nombre: "Ava" });
    expect(noah.pairing).toBe(0);
    expect(ava.pairing).toBe(0);
    await emparejamiento.actualizarPairing(noah, ava);
    expect(noah.pairing).toBe(1);
    expect(ava.pairing).toBe(-1);
  });
  test("actualizarPairing ganador con mas puntos", async () => {
    const ava = await Jugador.findOne({ nombre: "Ava" });
    const ethan = await Jugador.findOne({ nombre: "Ethan" });
    expect(ava.pairing).toBe(-1);
    expect(ethan.pairing).toBe(0);
    await emparejamiento.actualizarPairing(ethan, ava);
    expect(ava.pairing).toBe(-2);
    expect(ethan.pairing).toBe(0);
  });

  test("actualizarPairing ganador con menos puntos", async () => {
    const noah = await Jugador.findOne({ nombre: "Noah" });
    const ethan = await Jugador.findOne({ nombre: "Ethan" });
    console.log(noah);
    expect(noah.pairing).toBe(1);
    expect(ethan.pairing).toBe(0);
    await emparejamiento.actualizarPairing(noah, ethan);
    expect(noah.pairing).toBe(3);
    expect(ethan.pairing).toBe(-1);
  });
});
