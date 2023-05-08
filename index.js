const app = require("./app");
require("dotenv").config();
const mongoose = require("mongoose");
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(
  MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, res) => {
    if (err) {
      return console.log(`Error al conectar a la base de datos: ${err}`);
    }
    console.log("Conexión a la base de datos establecida...");
  }
);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
