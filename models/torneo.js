const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const torneoSchema = new Schema({
  nombreTorneo: { type: String, required: true },
  nombreTienda: { type: String, required: true },
  fecha: { type: String, required: true },
  numeroParticipantes: { type: Number, required: true },
  rondas: { type: Number, required: true },
  finalizada: { type: Boolean, required: true },
  jugadores: [{ type: String }],
});

const Torneo = mongoose.model("Torneo", torneoSchema);

module.exports = Torneo;
