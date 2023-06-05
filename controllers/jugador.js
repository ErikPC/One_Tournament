const repository = require("../repository/repositoryJugador");

async function createJugador(req, res) {
  try {
    const jugadorCreated = await repository.createJugador(req.body);
    res.status(201).send({ jugador: jugadorCreated });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

async function getJugadores(req, res) {
  try {
    var jugadores = await repository.getJugadores();
    res.status(200).send({ jugadores: jugadores });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

async function deleteJugador(req, res) {
  try {
    let nombre = req.params.nombre;
    let jugador = await repository.deleteJugador(nombre);
    if (jugador) {
      res.status(200).send({ message: "Jugador eliminado correctamente" });
    } else {
      res.status(404).send({ message: "Jugador no encontrado" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

async function updateJugador(req, res) {
  try {
    let nombre = req.params.nombre;
    let update = req.body;
    let jugador = await repository.updateJugador(nombre, update);
    if (jugador) {
      res.status(200).send({ message: "Jugador actualizado correctamente" });
    } else {
      res.status(404).send({ message: "Jugador no encontrado" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

async function getJugador(req, res) {
  try {
    let nombre = req.params.nombre;
    let jugador = await repository.getJugador(nombre);
    if (jugador) {
      res.status(200).send({ jugador: jugador });
    } else {
      res.status(404).send({ message: "Jugador no encontrado" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

async function getPuntosTorneo(req, res) {
  try {
    let nombre = req.params.nombre;
    let puntos = await repository.getPuntosTorneo(nombre);
    if (puntos) {
      res.status(200).send({ puntos: puntos });
    } else {
      res.status(404).send({ message: "Jugador no encontrado" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

async function setResultado(req, res) {
  try {
    const { nombre, resultado } = req.params;
    let jugador = await repository.getJugador(nombre);
    if (jugador) {
      await repository.setResultado(nombre, resultado);
      res.status(200).send({ message: "Resultado actualizado correctamente" });
    } else {
      res.status(404).send({ message: "Jugador no encontrado" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

module.exports = {
  getJugador,
  getJugadores,
  deleteJugador,
  updateJugador,
  createJugador,
  getPuntosTorneo,
  setResultado,
};
