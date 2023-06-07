/** @format */

const express = require("express");
const passwordResetController = require("../controllers/PasswordResetController");
const passWordResetRouter = express.Router();

passWordResetRouter.post("/", passwordResetController);

module.exports = passWordResetRouter;
