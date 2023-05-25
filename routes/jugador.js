const express = require("express");
const JugadorController = require("../controllers/jugador");
const md_auth = require("../middleware/autenticar");

const api = express.Router();

api.post("/jugador", [md_auth.ensureAuth], JugadorController.createJugador);
api.get("/jugador", [md_auth.ensureAuth], JugadorController.getJugadores);
api.get("/jugador/:nombre", [md_auth.ensureAuth], JugadorController.getJugador);
api.delete(
  "/jugador/:nombre",
  [md_auth.ensureAuth],
  JugadorController.deleteJugador
);
api.put(
  "/jugador/:nombre",
  [md_auth.ensureAuth],
  JugadorController.updateJugador
);
api.get(
  "/jugador/:nombre/puntosTorneo",
  [md_auth.ensureAuth],
  JugadorController.getPuntosTorneo
);
api.put(
  "/jugador/:nombre/:resultado",
  [md_auth.ensureAuth],
  JugadorController.setResultado
);
module.exports = api;
