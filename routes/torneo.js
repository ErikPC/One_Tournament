const express = require("express");
const TorneoController = require("../controllers/torneo");

const api = express.Router();

api.post("/torneo", TorneoController.createTorneo);
api.get("/torneo", TorneoController.getTorneos);
api.get("/torneo/:fecha/:nombreTienda", TorneoController.getTorneo);
api.delete("/torneo/:fecha/:nombreTienda", TorneoController.deleteTorneo);
api.put("/torneo/:fecha/:nombreTienda", TorneoController.updateTorneo);
api.put(
  "/torneo/:fecha/:nombreTienda/:jugador",
  TorneoController.añadirParticipante
);
api.get(
  "/torneo/:fecha/:nombreTienda/jugadores",
  TorneoController.getListaJugadores
);
module.exports = api;
