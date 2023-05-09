const repository = require("../repository/repositoryTienda");

async function createTienda(req, res) {
  try {
    const tiendaCreated = await repository.createTienda(req.body);
    res.status(201).send({ tienda: tiendaCreated });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

async function getTiendas(req, res) {
  try {
    var tiendas = await repository.getTiendas();
    res.status(200).send({ tiendas: tiendas });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

async function deleteTienda(req, res) {
  try {
    let nombre = req.params.nombre;
    let tienda = await repository.deleteTienda(nombre);
    if (tienda) {
      res.status(200).send({ message: "Tienda eliminada correctamente" });
    } else {
      res.status(404).send({ message: "Tienda no encontrada" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

async function updateTienda(req, res) {
  try {
    let nombre = req.params.nombre;
    let update = req.body;
    let tienda = await repository.updateTienda(nombre, update);
    if (tienda) {
      res.status(200).send({ message: "Tienda actualizada correctamente" });
    } else {
      res.status(404).send({ message: "Tienda no encontrada" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

async function getTienda(req, res) {
  try {
    let nombre = req.params.nombre;
    let tienda = await repository.getTienda(nombre);
    if (tienda) {
      res.status(200).send({ tienda: tienda });
    } else {
      res.status(404).send({ message: "Tienda no encontrada" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

module.exports = {
  getTienda,
  getTiendas,
  createTienda,
  deleteTienda,
  updateTienda,
};
