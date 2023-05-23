const express = require("express");
const TorneoController = require("../controllers/torneo");

const api = express.Router();

api.post("/torneo", TorneoController.createTorneo);
api.get("/torneo", TorneoController.getTorneos);
api.get("/torneo/:fecha/:nombreTienda", TorneoController.getTorneo);
api.delete("/torneo/:fecha/:nombreTienda", TorneoController.deleteTorneo);
api.put("/torneo/:fecha/:nombreTienda", TorneoController.updateTorneo);
api.put(
  "/torneo/:fecha/:nombreTienda/anadir/:jugador",
  TorneoController.añadirParticipante
);
api.put(
  "/torneo/:fecha/:nombreTienda/eliminar/:jugador",
  TorneoController.eliminarParticipante
);
api.get(
  "/torneo/:fecha/:nombreTienda/jugadores",
  TorneoController.getPuntosJugadores
);
api.put(
  "/torneo/:fecha/:nombreTienda/calcular/calculoRonda",
  TorneoController.calculoRonda
);
api.get(
  "/torneo/:fecha/:nombreTienda/emparejar",
  TorneoController.emparejarTorneo
);
api.put(
  "/torneo/:fecha/:nombreTienda/pairing/:jugador1/:jugador2/",
  TorneoController.pairing
);
module.exports = api;
