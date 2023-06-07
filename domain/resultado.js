function sumarPuntos(puntosTotales, resultado) {
  if (resultado == "W") {
    puntosTotales += 3;
  } else if (resultado == "L") {
    puntosTotales += 0;
  } else {
    puntosTotales += 1;
  }
  return puntosTotales;
}

module.exports = { sumarPuntos };
