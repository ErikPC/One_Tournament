const mongoose = require("mongoose");

const jugadorSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  edad: {
    type: Number,
    required: true,
  },
  puntosTotales: {
    type: Number,
    default: 0,
  },
  puntosTorneo: {
    type: Number,
    default: 0,
  },
  puntosUltimoTorneo: {
    type: Number,
    default: 0,
  },
  pairing: {
    type: Number,
    default: 0,
  },
  resultado: {
    type: String,
    enum: ["W", "L", "D"],
    default: "D",
  },
});

module.exports = mongoose.model("Jugador", jugadorSchema);
