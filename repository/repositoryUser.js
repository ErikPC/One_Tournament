const bcrypt = require("bcryptjs");
const User = require("../models/user");

async function register(user) {
  let salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  let userCreated = await User.create(user);
  return userCreated;
}
async function getUserByMail(mail) {
  let user = await User.findOne({ email: mail });
  return user;
}
module.exports = {
  register,
  getUserByMail,
};
