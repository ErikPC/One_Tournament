const mongoose = require("mongoose");

const tiendaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  direccion: {
    type: String,
    required: true,
  },
  telefono: {
    type: String,
    required: true,
  },
  mail: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("Tienda", tiendaSchema);
