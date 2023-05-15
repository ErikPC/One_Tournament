const mongoose = require("mongoose");
const Schema = moon.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: false,
  },
  lastname: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("User", userSchema);
