const repository = require("../repository/repositoryTorneo");
const Torneo = require("../models/torneo");
async function createTorneo(req, res) {
  try {
    const torneoCreated = await repository.createTorneo(req.body);

    if (torneoCreated) {
      res.status(200).send({ message: "Torneo creado correctamente" });
    } else {
      res.status(400).send({ message: "Error al crear torneo" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

async function getTorneos(req, res) {
  try {
    var troneos = await repository.getTorneos();
    res.status(200).send({ torneos: troneos });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

async function deleteTorneo(req, res) {
  try {
    let fecha = req.params.fecha;
    let nombreTienda = req.params.nombreTienda;
    let torneo = await repository.deleteTorneo(fecha, nombreTienda);
    if (torneo) {
      res.status(200).send({ message: "Torneo eliminado correctamente" });
    } else {
      res.status(404).send({ message: "Torneo no encontrado" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

async function updateTorneo(req, res) {
  try {
    let fecha = req.params.fecha;
    let nombreTienda = req.params.nombreTienda;
    let update = req.body;
    let torneo = await repository.updateTorneo(fecha, nombreTienda, update);
    if (torneo) {
      res.status(200).send({ message: "Torneo actualizado correctamente" });
    } else {
      res.status(404).send({ message: "Torneo no encontrado" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

async function getTorneo(req, res) {
  try {
    let fecha = req.params.fecha;
    let nombreTienda = req.params.nombreTienda;
    let torneo = await repository.getTorneo(fecha, nombreTienda);
    if (torneo) {
      res.status(200).send({ torneo: torneo });
    } else {
      res.status(404).send({ message: "Torneo no encontrado" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
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
      if (jugadores.includes(jugador)) {
        res.status(400).send({ message: "Jugador ya añadido" });
      }
      if (jugadores.length >= response.numeroParticipantes) {
        res.status(400).send({ message: "Torneo completo" });
      }
      if (response.finalizada) {
        res.status(400).send({ message: "Torneo finalizado" });
      }
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
