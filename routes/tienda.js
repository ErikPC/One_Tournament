const express = require("express");
const TiendaController = require("../controllers/tienda");
const md_auth = require("../middleware/autenticar");

const api = express.Router();

api.get("/tienda", [md_auth.ensureAuth], TiendaController.getTiendas);
api.post("/tienda", [md_auth.ensureAuth], TiendaController.createTienda);
api.get("/tienda/:nombre", [md_auth.ensureAuth], TiendaController.getTienda);
api.delete(
  "/tienda/:nombre",
  [md_auth.ensureAuth],
  TiendaController.deleteTienda
);
api.put("/tienda/:nombre", [md_auth.ensureAuth], TiendaController.updateTienda);

module.exports = api;
