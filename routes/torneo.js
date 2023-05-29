const express = require("express");
const TorneoController = require("../controllers/torneo");

const md_auth = require("../middleware/autenticar");

const api = express.Router();

api.post("/torneo", [md_auth.ensureAuth], TorneoController.createTorneo);
api.get("/torneo", [md_auth.ensureAuth], TorneoController.getTorneos);
api.get(
  "/torneo/:fecha/:nombreTienda",
  [md_auth.ensureAuth],
  TorneoController.getTorneo
);
api.delete(
  "/torneo/:fecha/:nombreTienda",
  [md_auth.ensureAuth],
  TorneoController.deleteTorneo
);
api.put(
  "/torneo/:fecha/:nombreTienda",
  [md_auth.ensureAuth],
  TorneoController.updateTorneo
);
api.put(
  "/torneo/:fecha/:nombreTienda/anadir/:jugador",
  [md_auth.ensureAuth],
  TorneoController.añadirParticipante
);
api.put(
  "/torneo/:fecha/:nombreTienda/eliminar/:jugador",
  [md_auth.ensureAuth],
  TorneoController.eliminarParticipante
);
api.get(
  "/torneo/:fecha/:nombreTienda/jugadores",
  [md_auth.ensureAuth],
  TorneoController.getPuntosJugadores
);
api.put(
  "/torneo/:fecha/:nombreTienda/calcular/calculoRonda",
  [md_auth.ensureAuth],
  TorneoController.calculoRonda
);
api.get(
  "/torneo/:fecha/:nombreTienda/emparejar",
  [md_auth.ensureAuth],
  TorneoController.emparejarTorneo
);
api.put(
  "/torneo/:fecha/:nombreTienda/pairing/:jugador1/:jugador2/",
  [md_auth.ensureAuth],
  TorneoController.pairing
);
module.exports = api;
