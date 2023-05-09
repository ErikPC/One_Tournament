const express = require("express");
const TiendaController = require("../controllers/tienda");

const api = express.Router();

api.get("/tienda", TiendaController.getTiendas);
api.post("/tienda", TiendaController.createTienda);
api.get("/tienda/:nombre", TiendaController.getTienda);
api.delete("/tienda/:nombre", TiendaController.deleteTienda);
api.put("/tienda/:nombre", TiendaController.updateTienda);

module.exports = api;
