const express = require("express");
const TorneoController = require("../controllers/torneo");

const api = express.Router();

api.post("/torneo", TorneoController.createTorneo);

module.exports = api;
