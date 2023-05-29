const repository = require("../repository/repositoryTorneo");
const repositoryJugador = require("../repository/repositoryJugador");
const calculoResultado = require("../domain/resultado");
const emparejamiento = require("../domain/emparejamiento");

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
  try {
    const response = await repository.getTorneo(fecha, nombreTienda);

    if (!response) {
      return res.status(404).send({ message: "Torneo no encontrado" });
    }

    let jugadores = response.jugadores;

    if (jugadores.includes(jugador)) {
      return res.status(400).send({ message: "Jugador ya añadido" });
    }

    if (jugadores.length >= response.numeroParticipantes) {
      return res.status(400).send({ message: "Torneo completo" });
    }

    if (response.finalizada) {
      return res.status(400).send({ message: "Torneo finalizado" });
    }

    jugadores.push(jugador);

    await repository.updateTorneo(fecha, nombreTienda, { jugadores });

    res.status(200).send({ message: "Jugador añadido correctamente" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

async function eliminarParticipante(req, res) {
  const { fecha, nombreTienda, jugador } = req.params;
  try {
    const response = await repository.getTorneo(fecha, nombreTienda);
    if (!response) {
      return res.status(404).send({ message: "Torneo no encontrado" });
    }
    let jugadores = response.jugadores;
    if (response.finalizada) {
      return res.status(400).send({ message: "Torneo finalizado" });
    }
    jugadores = jugadores.filter((j) => j !== jugador);
    await repository.updateTorneo(fecha, nombreTienda, { jugadores });
    return res.status(200).send({ message: "Jugador eliminado correctamente" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
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

    if (!torneo) {
      return res.status(404).send({ message: "Torneo no encontrado" });
    } else if (torneo.finalizada) {
      return res.status(400).send({ message: "Torneo finalizado" });
    } else if (torneo.rondas === 0) {
      await repository.updateTorneo(fecha, nombreTienda, {
        finalizada: true,
      });
      actualizarPuntosUltimoTorneoJugadores(torneo.jugadores);
      actualizarPuntosTotalesJugadores(torneo.jugadores);
      eliminarParing(torneo.jugadores);
      return res.status(200).send({
        message: "Torneo finalizado",
        resultado: await emparejamiento.getListaJugadores(torneo),
      });
    }

    let jugadores = torneo.jugadores;
    actualizarPuntosTorneo(jugadores);

    await repository.updateTorneo(fecha, nombreTienda, {
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
    const { fecha, nombreTienda, jugador1, jugador2 } = req.params;

    let torneo = await repository.getTorneo(fecha, nombreTienda);

    if (!torneo) {
      return res.status(404).send({ message: "Torneo no encontrado" });
    }

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
