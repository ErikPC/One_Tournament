const express = require("express");
const TiendaController = require("../controllers/tienda");

const api = express.Router();

api.get("/tienda", TiendaController.getTienda);

module.exports = api;
