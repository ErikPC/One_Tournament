const express = require("express");
const JugadorController = require("../controllers/jugador");

const api = express.Router();

api.post("/jugador", JugadorController.createJugador);
api.get("/jugador", JugadorController.getJugadores);
api.get("/jugador/:nombre", JugadorController.getJugador);
api.delete("/jugador/:nombre", JugadorController.deleteJugador);
api.put("/jugador/:nombre", JugadorController.updateJugador);
api.get("/jugador/:nombre/puntosTorneo", JugadorController.getPuntosTorneo);
api.put("/jugador/:nombre/:resultado", JugadorController.setResultado);
module.exports = api;