/** @format */

const express = require("express");
const { registrationController } = require("../controllers/AuthController");

const authRouter = express.Router();

authRouter.post("/signup", registrationController);

module.exports = authRouter;
