const repository = require("../repository/repositoryTorneo");
const repositoryJugador = require("../repository/repositoryJugador");
const calculoResultado = require("../domain/resultado");
const emparejamiento = require("../domain/emparejamiento");
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
    const { fecha, nombreTienda } = req.params;
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
    const { fecha, nombreTienda } = req.params;
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
    const { fecha, nombreTienda } = req.params;
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

async function añadirParticipante(req, res) {
  const { fecha, nombreTienda, jugador } = req.params;
  await repository.getTorneo(fecha, nombreTienda).then((response) => {
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
      repository
        .updateTorneo(fecha, nombreTienda, { jugadores: jugadores })
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

async function eliminarParticipante(req, res) {
  const { fecha, nombreTienda, jugador } = req.params;
  await repository.getTorneo(fecha, nombreTienda).then((response) => {
    if (!response) {
      res.status(404).send({ message: "Torneo no encontrado" });
    } else {
      let jugadores = response.jugadores;
      if (!jugadores.includes(jugador)) {
        res.status(400).send({ message: "Jugador no añadido" });
      }
      if (jugadores.length >= response.numeroParticipantes) {
        res.status(400).send({ message: "Torneo completo" });
      }
      if (response.finalizada) {
        res.status(400).send({ message: "Torneo finalizado" });
      }
      jugadores.pop(jugador);
      repository
        .updateTorneo(fecha, nombreTienda, { jugadores: jugadores })
        .then((response) => {
          res.status(200).send({
            message: "Jugador eliminado correctamente",
          });
        })
        .catch((err) => {
          res.status(500).send({ message: err.message });
        });
    }
  });
}

async function getPuntosJugadores(req, res) {
  try {
    const { fecha, nombreTienda } = req.params;
    let torneo = await repository.getTorneo(fecha, nombreTienda);
    if (torneo) {
      res.status(200).send({
        jugadores: await emparejamiento.getListaJugadores(torneo),
      });
    } else {
      res.status(404).send({ message: "Torneo no encontrado" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

async function calculoRonda(req, res) {
  try {
    const { fecha, nombreTienda } = req.params;

    let torneo = await repository.getTorneo(fecha, nombreTienda);
    let jugadores = torneo.jugadores;

    if (!torneo) {
      return res.status(404).send({ message: "Torneo no encontrado" });
    } else if (torneo.finalizada) {
      return res.status(400).send({ message: "Torneo finalizado" });
    } else if (torneo.rondas == 0) {
      await repository.updateTorneo(fecha, nombreTienda, {
        finalizada: true,
      });
      actualizarPuntosUltimoTorneoJugadores(jugadores);
      actualizarPuntosTotalesJugadores(jugadores);
      eliminarParing(jugadores);
      return res.status(200).send({
        message: "Torneo finalizado",
        resultado: await emparejamiento.getListaJugadores(torneo),
      });
    }
    actualizarPuntosTorneo(jugadores);

    // Actualizar ronda del torneo
    await repository.updateTorneo(fecha, nombreTienda, {
      // operador $in para ir restando rondas
      $inc: { rondas: -1 },
    });
    res
      .status(200)
      .send({ message: "Cálculo de ronda realizado correctamente" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}
async function pairing(req, res) {
  try {
    let jugador1 = req.params.jugador1;
    let jugador2 = req.params.jugador2;

    let ganador = await repositoryJugador.getJugador(jugador1);
    let perdedor = await repositoryJugador.getJugador(jugador2);
    emparejamiento.actualizarPairing(ganador, perdedor);
    res.status(200).send({ message: "Pairing actualizado correctamente" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}
async function emparejarTorneo(req, res) {
  try {
    const { fecha, nombreTienda } = req.params;

    let torneo = await repository.getTorneo(fecha, nombreTienda);

    if (!torneo) {
      return res.status(404).send({ message: "Torneo no encontrado" });
    } else if (torneo.finalizada) {
      return res.status(400).send({ message: "Torneo finalizado" });
    } else {
      let listaJugadores = await emparejamiento.getListaJugadores(torneo);

      if (listaJugadores) {
        let parejas = emparejamiento.emparejar(listaJugadores);

        res.status(200).send({
          parejas: parejas,
        });
      } else {
        return res
          .status(404)
          .send({ message: "No hay jugadores en el torneo" });
      }
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}
async function actualizarPuntosUltimoTorneoJugadores(jugadores) {
  for (let jugador of jugadores) {
    let jugadorDB = await repositoryJugador.getJugador(jugador);
    if (!jugadorDB) {
      console.log(`Jugador '${jugador}' no encontrado`);
      continue;
    }
    let puntosTorneo = jugadorDB.puntosTorneo;
    await repositoryJugador.updateJugador(jugador, {
      puntosUltimoTorneo: puntosTorneo,
      puntosTorneo: 0,
    });
  }
}
async function actualizarPuntosTotalesJugadores(jugadores) {
  for (let jugador of jugadores) {
    let jugadorDB = await repositoryJugador.getJugador(jugador);
    if (!jugadorDB) {
      console.log(`Jugador '${jugador}' no encontrado`);
      continue;
    }
    let puntosTotales = jugadorDB.puntosTotales;
    let puntosTorneo = jugadorDB.puntosTorneo;
    let nuevosPuntos = puntosTotales + puntosTorneo;
    await repositoryJugador.updateJugador(jugador, {
      puntosTotales: nuevosPuntos,
    });
  }
}

async function eliminarParing(jugadores) {
  for (let jugador of jugadores) {
    let jugadorDB = await repositoryJugador.getJugador(jugador);
    if (!jugadorDB) {
      console.log(`Jugador '${jugador}' no encontrado`);
      continue;
    }
    await repositoryJugador.updateJugador(jugador, {
      pairing: 0,
    });
  }
}

async function actualizarPuntosTorneo(jugadores) {
  for (let jugador of jugadores) {
    // Actualizar puntos del jugador
    let jugadorDB = await repositoryJugador.getJugador(jugador);

    if (!jugadorDB) {
      console.log(`Jugador '${jugador}' no encontrado`);
      continue;
    }
    let puntosTorneo = jugadorDB.puntosTorneo;
    let resultado = jugadorDB.resultado;
    let nuevosPuntos = calculoResultado.sumarPuntos(puntosTorneo, resultado);

    await repositoryJugador.updateJugador(jugador, {
      puntosTorneo: nuevosPuntos,
    });
  }
}
module.exports = {
  createTorneo,
  getTorneos,
  deleteTorneo,
  updateTorneo,
  getTorneo,
  añadirParticipante,
  eliminarParticipante,
  getPuntosJugadores,
  calculoRonda,
  emparejarTorneo,
  pairing,
};
