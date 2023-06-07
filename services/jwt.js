const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_TOKEN = process.env.SECRET_TOKEN;

function createToken(user, expiresIn) {
  const { id, mail } = user;
  const payload = { id, mail };
  return jwt.sign(payload, SECRET_TOKEN, { expiresIn });
}

function decodeToken(token) {
  return jwt.decode(token, SECRET_TOKEN);
}

module.exports = {
  createToken,
  decodeToken,
};
