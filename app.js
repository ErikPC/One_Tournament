const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const tiendaRoutes = require("./routes/tienda");
const torneoRoutes = require("./routes/torneo");
const jugadorRoutes = require("./routes/jugador");

app.use("/api", jugadorRoutes);
app.use("/api", tiendaRoutes);
app.use("/api", torneoRoutes);

module.exports = app;
