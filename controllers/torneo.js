const repository = require("../repository/repositoryTorneo");
const Jugador = require("../models/jugador");
const Torneo = require("../models/torneo");

const calculoResultado = require("../domain/resultado");

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

async function getListaJugadores(req, res) {
  try {
    let fecha = req.params.fecha;
    let nombreTienda = req.params.nombreTienda;
    let torneo = await repository.getTorneo(fecha, nombreTienda);
    if (torneo) {
      res.status(200).send({ jugadores: torneo.jugadores });
    } else {
      res.status(404).send({ message: "Torneo no encontrado" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

async function calculoRonda(req, res) {
  try {
    let fecha = req.params.fecha;
    let nombreTienda = req.params.nombreTienda;

    let torneo = await Torneo.findOne({
      fecha: fecha,
      nombreTienda: nombreTienda,
    });

    let jugadores = torneo.jugadores;

    if (!torneo) {
      return res.status(404).send({ message: "Torneo no encontrado" });
    } else if (torneo.finalizada) {
      return res.status(400).send({ message: "Torneo finalizado" });
    } else if (torneo.rondas == 0) {
      await Torneo.findOneAndUpdate(
        { fecha: fecha, nombreTienda: nombreTienda },
        { finalizada: true }
      );
      actualizarPuntosUltimoTorneoJugadores(jugadores);
      return res.status(200).send({ message: "Torneo finalizado" });
    }
    actualizarPuntosTorneo(jugadores);

    // Actualizar ronda del torneo
    await Torneo.findOneAndUpdate(
      { fecha: fecha, nombreTienda: nombreTienda },
      { $inc: { rondas: -1 } }
    );

    res
      .status(200)
      .send({ message: "Cálculo de ronda realizado correctamente" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}
async function actualizarPuntosUltimoTorneoJugadores(jugadores) {
  for (let jugador of jugadores) {
    let jugadorDB = await Jugador.findOne({ nombre: jugador });
    if (!jugadorDB) {
      console.log(`Jugador '${jugador}' no encontrado`);
      continue;
    }
    let puntosTorneo = jugadorDB.puntosTorneo;
    await Jugador.findOneAndUpdate(
      { nombre: jugador },
      { puntosUltimoTorneo: puntosTorneo, puntosTorneo: 0 }
    );
  }
}

async function actualizarPuntosTorneo(jugadores) {
  for (let jugador of jugadores) {
    // Actualizar puntos del jugador
    let jugadorDB = await Jugador.findOne({ nombre: jugador });

    if (!jugadorDB) {
      console.log(`Jugador '${jugador}' no encontrado`);
      continue;
    }
    let puntosTorneo = jugadorDB.puntosTorneo;
    let resultado = jugadorDB.resultado;
    let nuevosPuntos = calculoResultado.sumarPuntos(puntosTorneo, resultado);

    await Jugador.findOneAndUpdate(
      { nombre: jugador },
      { puntosTorneo: nuevosPuntos }
    );
  }
}
module.exports = {
  createTorneo,
  getTorneos,
  deleteTorneo,
  updateTorneo,
  getTorneo,
  añadirParticipante,
  getListaJugadores,
  calculoRonda,
};
