/** @format */

const express = require("express");
const {
	sendEmailForResettingPasswordController,
	passwordResettingController,
	confirmResetPasswordController,
} = require("../controllers/PasswordResetController");

const passWordResetRouter = express.Router();

passWordResetRouter.post("/", sendEmailForResettingPasswordController);
passWordResetRouter.get(
	"/reset-password/:requestId",
	passwordResettingController,
);
passWordResetRouter.post(
	"/confirmResetPassword",
	confirmResetPasswordController,
);

module.exports = passWordResetRouter;
