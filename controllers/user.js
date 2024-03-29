const repository = require("../repository/repositoryUser");
const jwt = require("../services/jwt");
const bcrypt = require("bcryptjs");

async function register(req, res) {
  const { email, password } = req.body;
  try {
    checkMailAndPass(email, password);
    const user = await repository.getUserByMail(email);
    checkUserExist(user);
    let userCreated = await repository.register(req.body);
    res.status(201).send({ user: userCreated });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
}

function checkUserExist(user) {
  if (user) {
    throw new Error("The user already exists");
  }
}

function checkMailAndPass(mail, pass) {
  if (!mail || !pass) {
    throw new Error("Email and password are required");
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await repository.getUserByMail(email);
    if (!user) {
      throw { msg: "Error mail o contraseña" };
    }
    const passOK = bcrypt.compareSync(password, user.password);
    if (!passOK) {
      // sin especificar si es mail o contraseña para no dar pistas y crear agujeros de seguridad
      throw { msg: "Error mail o contraseña" };
    }
    res.status(200).send({
      message: "Login correcto",
      token: jwt.createToken(user, "12h"),
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

function protectedRoute(req, res) {
  res.status(200).send({ message: "Ruta protegida" });
}

module.exports = {
  register,
  login,
  protectedRoute,
};
