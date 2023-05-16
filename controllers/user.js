const repository = require("../repository/repositoryUser");

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

module.exports = {
  register,
};
