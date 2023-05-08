const Torneo = require("../models/torneo");

function createTorneo(req, res) {
  const torneo = new Torneo({
    nombreTorneo: req.body.nombreTorneo,
    nombreTienda: req.body.nombreTienda,
    fecha: req.body.fecha,
    numeroParticipantes: req.body.numeroParticipantes,
    rondas: req.body.rondas,
    finalizada: req.body.finalizada,
    jugadores: req.body.jugadores,
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

function updateTorneo(req, res) {
  let fecha = req.params.fecha;
  let nombreTienda = req.params.nombreTienda;
  let update = req.body;
  Torneo.findOneAndUpdate({ fecha: fecha, nombreTienda: nombreTienda }, update)
    .then((response) => {
      res.status(200).send({ message: "Torneo actualizado correctamente" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}

function getTorneo(req, res) {
  let fecha = req.params.fecha;
  let nombreTienda = req.params.nombreTienda;
  Torneo.findOne({ fecha: fecha, nombreTienda: nombreTienda })
    .then((response) => {
      if (!response) {
        res.status(404).send({ message: "Torneo no encontrado" });
      } else {
        res.status(200).send({ torneo: response });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}

function añadirParticipante(req, res) {
  let fecha = req.params.fecha;
  let nombreTienda = req.params.nombreTienda;
  let jugador = req.params.jugador;
  let torneo = Torneo.findOne({ fecha: fecha, nombreTienda: nombreTienda });
  torneo.then((response) => {
    if (!response) {
      res.status(404).send({ message: "Torneo no encontrado" });
    } else {
      let jugadores = response.jugadores;
      jugadores.push(jugador);
      Torneo.findOneAndUpdate(
        { fecha: fecha, nombreTienda: nombreTienda },
        { jugadores: jugadores }
      )
        .then((response) => {
          res.status(200).send({
            message: "Jugador añadido correctamente",
          });
        })
        .catch((err) => {
          res.status(500).send({ message: err.message });
        });
    }
  });
}
module.exports = {
  createTorneo,
  getTorneos,
  deleteTorneo,
  updateTorneo,
  getTorneo,
  añadirParticipante,
};
