repository = require("../repository/repositoryJugador");

async function getListaJugadores(torneo) {
  let tabla = {};
  if (torneo) {
    for (let i = 0; i < torneo.jugadores.length; i++) {
      let jugador = await repository.getJugador(torneo.jugadores[i]);
      tabla[jugador.nombre] = jugador.puntosTorneo;
    }

    return ordenarJugadoresPorPuntos(tabla);
  } else {
    return null;
  }
}

function ordenarJugadoresPorPuntos(tabla) {
  let jugadores = Object.entries(tabla).map(([nombre, puntos]) => ({
    nombre,
    puntos,
  }));
  return jugadores.sort((a, b) => b.puntos - a.puntos);
}

module.exports = {
  getListaJugadores,
};
