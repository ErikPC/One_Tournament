const express = require("express");
const TorneoController = require("../controllers/torneo");

const api = express.Router();

api.post("/torneo", TorneoController.createTorneo);
api.get("/torneo", TorneoController.getTorneos);
api.delete("/torneo/:fecha/:nombreTienda", TorneoController.deleteTorneo);
module.exports = api;
