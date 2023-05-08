const express = require("express");
const app = express();

const tiendaRoutes = require("./routes/tienda");

app.use("/api", tiendaRoutes);

module.exports = app;
