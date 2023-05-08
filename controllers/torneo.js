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

module.exports = {
  createTorneo,
};
