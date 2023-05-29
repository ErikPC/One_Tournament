const Torneo = require("../models/torneo");

async function createTorneo(torneo) {
  let torneoCreated = await Torneo.create(torneo);
  return torneoCreated;
}

async function getTorneos() {
  let torneos = await Torneo.find();
  return torneos;
}

function deleteTorneo(fecha, nombreTienda) {
  return Torneo.findOneAndDelete({ fecha: fecha, nombreTienda: nombreTienda });
}

function updateTorneo(fecha, nombreTienda, update) {
  return Torneo.findOneAndUpdate(
    { fecha: fecha, nombreTienda: nombreTienda },
    update
  );
}

function getTorneo(fecha, nombreTienda) {
  return Torneo.findOne({ fecha: fecha, nombreTienda: nombreTienda });
}

module.exports = {
  createTorneo,
  getTorneos,
  deleteTorneo,
  updateTorneo,
  getTorneo,
};
