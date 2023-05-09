const Tienda = require("../models/tienda");

async function createTienda(tienda) {
  let tiendaCreated = await Tienda.create(tienda);
  return tiendaCreated;
}

async function getTiendas() {
  let tiendas = await Tienda.find();
  return tiendas;
}

function deleteTienda(nombre) {
  return Tienda.findOneAndDelete({ nombre: nombre });
}

function updateTienda(nombre, update) {
  return Tienda.findOneAndUpdate({ nombre: nombre }, update);
}

function getTienda(nombre) {
  return Tienda.findOne({ nombre: nombre });
}

module.exports = {
  createTienda,
  getTiendas,
  deleteTienda,
  updateTienda,
  getTienda,
};
