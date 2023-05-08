const express = require("express");
const TorneoController = require("../controllers/torneo");

const api = express.Router();

api.post("/torneo", TorneoController.createTorneo);
api.get("/torneo", TorneoController.getTorneos);
api.delete("/torneo/:fecha/:nombreTienda", TorneoController.deleteTorneo);
api.put("/torneo/:fecha/:nombreTienda", TorneoController.updateTorneo);
module.exports = api;
