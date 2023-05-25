const express = require("express");
const UserController = require("../controllers/user");

const md_auth = require("../middleware/autenticar");

const api = express.Router();

api.post("/register", UserController.register);
api.post("/login", UserController.login);
api.get("/protected", [md_auth.ensureAuth], UserController.protectedRoute);

module.exports = api;
