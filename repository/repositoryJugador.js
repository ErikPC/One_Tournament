const Jugador = require("../models/jugador");

async function createJugador(jugador) {
  let jugadorCreated = await Jugador.create(jugador);
  return jugadorCreated;
}

async function getJugadores() {
  let jugadores = await Jugador.find();
  return jugadores;
}

function deleteJugador(nombre) {
  return Jugador.findOneAndDelete({ nombre: nombre });
}

function updateJugador(nombre, update) {
  return Jugador.findOneAndUpdate({ nombre: nombre }, update);
}

function getJugador(nombre) {
  return Jugador.findOne({ nombre: nombre });
}

function getPuntosTorneo(nombre) {
  return Jugador.findOne({ nombre: nombre }, { puntosTorneo: 1 });
}

module.exports = {
  createJugador,
  getJugadores,
  deleteJugador,
  updateJugador,
  getJugador,
  getPuntosTorneo,
};
