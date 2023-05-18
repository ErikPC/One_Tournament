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

function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = repository.getUserByMail(email);
    if (!user) {
      throw { msg: "Error mail o contraseña" };
    }
    const passOK = bcrypt.compareSync(password, user.password);
    if (!passOK) {
      throw { msg: "Error mail o contraseña" };
    }
    res.status(200).send({
      message: "Login correcto",
      token: jwt.createToken(user, "12h"),
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
}

module.exports = {
  register,
};
