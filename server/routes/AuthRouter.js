/** @format */

const express = require("express");
const {
	registrationController,
	loginController,
} = require("../controllers/AuthController");

const authRouter = express.Router();

authRouter.post("/signup", registrationController);
authRouter.post("/login", loginController);

module.exports = authRouter;
