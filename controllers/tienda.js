function getTienda(req, res) {
  res.status(200).send({ tienda: "Tienda" });
}

module.exports = {
  getTienda,
};
