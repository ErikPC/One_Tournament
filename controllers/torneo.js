const Torneo = require("../models/torneo");

function createTorneo(req, res) {
  const torneo = new Torneo({
    nombreTorneo: req.body.nombreTorneo,
    nombreTienda: req.body.nombreTienda,
    fecha: req.body.fecha,
    numeroParticipantes: req.body.numeroParticipantes,
    rondas: req.body.rondas,
    finalizada: req.body.finalizada,
  });

  torneo
    .save()
    .then((response) => {
      res.status(200).send({ message: "Torneo creado correctamente" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}
function getTorneos(req, res) {
  Torneo.find()
    .then((response) => {
      res.status(200).send({ torneos: response });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}

function deleteTorneo(req, res) {
  let fecha = req.params.fecha;
  let nombreTienda = req.params.nombreTienda;
  Torneo.findOneAndDelete({ fecha: fecha, nombreTienda: nombreTienda })
    .then((response) => {
      res.status(200).send({ message: "Torneo eliminado correctamente" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}
module.exports = {
  createTorneo,
  getTorneos,
  deleteTorneo,
};
