const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const tiendaRoutes = require("./routes/tienda");
const torneoRoutes = require("./routes/torneo");
const jugadorRoutes = require("./routes/jugador");
const userRoutes = require("./routes/user");

app.use("/api", jugadorRoutes);
app.use("/api", tiendaRoutes);
app.use("/api", torneoRoutes);
app.use("/api", userRoutes);

module.exports = app;
