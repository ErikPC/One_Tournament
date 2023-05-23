repository = require("../repository/repositoryJugador");

async function getListaJugadores(torneo) {
  let listaJugadores = [];
  if (torneo) {
    for (let i = 0; i < torneo.jugadores.length; i++) {
      let jugador = await repository.getJugador(torneo.jugadores[i]);
      if (jugador) {
        listaJugadores.push({
          nombre: jugador.nombre,
          puntos: jugador.puntosTorneo,
        });
      }
    }

    listaJugadores.sort((a, b) => b.puntos - a.puntos);

    return listaJugadores;
  } else {
    return null;
  }
}

function emparejar(listaJugadores) {
  let parejas = [];

  for (let i = 0; i < listaJugadores.length - 1; i += 2) {
    let jugador1 = listaJugadores[i];
    let jugador2 = listaJugadores[i + 1];

    // Crea la pareja
    let pareja = {
      jugador1: {
        nombre: jugador1.nombre,
        puntos: jugador1.puntos,
      },
      jugador2: {
        nombre: jugador2.nombre,
        puntos: jugador2.puntos,
      },
    };

    parejas.push(pareja);
  }

  // Si queda un jugador sin pareja, asigna un "BYE" al jugador
  if (listaJugadores.length % 2 !== 0) {
    let jugadorBye = listaJugadores[listaJugadores.length - 1];

    // asigna el jugador con "BYE"
    let parejaBye = {
      jugador1: {
        nombre: jugadorBye.nombre,
        puntos: jugadorBye.puntos,
        bye: true,
      },
    };

    parejas.push(parejaBye);
  }

  return parejas;
}

async function actualizarPairing(ganador, perdedor) {
  if (ganador.resultado === "D" && perdedor.resultado === "D") {
    ganador.resultado = "D";
    perdedor.resultado = "D";
  } else if (ganador.puntos === perdedor.puntos) {
    ganador.puntos += 1;
    perdedor.puntos -= 1;
    ganador.resultado = "W";
    perdedor.resultado = "L";
  } else if (ganador.puntos > perdedor.puntos) {
    perdedor.puntos -= 1;
    ganador.resultado = "W";
    perdedor.resultado = "L";
  } else {
    ganador.puntos += 2;
    perdedor.puntos -= 1;
    ganador.resultado = "W";
    perdedor.resultado = "L";
  }

  ganador.pairing += 1;
  perdedor.pairing += 1;

  // Guardar los cambios en la base de datos
  await repository.updateJugador(ganador.nombre, {
    pairing: ganador.pairing,
    resultado: ganador.resultado,
  });
  await repository.updateJugador(perdedor.nombre, {
    pairing: perdedor.pairing,
    resultado: perdedor.resultado,
  });
}

module.exports = {
  getListaJugadores,
  emparejar,
  actualizarPairing,
};
