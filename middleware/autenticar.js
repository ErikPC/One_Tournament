const moment = require("moment");
const jwt = require("../services/jwt");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

function ensureAuth(req, res, next) {
  if (!req.headers.authorization) {
    return res
      .status(403)
      .send({ message: "La petición no tiene la cabecera de autenticación" });
  }
  // elimina comillas
  const token = req.headers.authorization.replace(/['"]+/g, "");
  const payload = jwt.decodeToken(token, SECRET_KEY);
  try {
    //comprobar que no ha expirado con moment
    if (payload.exp <= moment().unix()) {
      return res.status(400).send({ message: "El token ha expirado" });
    }
  } catch (error) {
    return res.status(404).send({ message: "Token no válido" });
  }
  req.user = payload;
  next();
}

module.exports = {
  ensureAuth,
};
