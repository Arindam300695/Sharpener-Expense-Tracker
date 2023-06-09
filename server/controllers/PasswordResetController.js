/** @format */

const sequelize = require("../database/Database");
const nodemailer = require("nodemailer");
const ForgotPasswordRequest = require("../models/ForgetPasswordRequestsMode");
const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const saltRounds = 12;
require("dotenv").config();

// very first post request that will be fired from the user side if any user wants to reset his/her password and this controller will simply check if the user exists with the given email id that he/she is provided and if the user exists in our database then we are just creating the password reset request for that user and sending the user password reset link
const sendEmailForResettingPasswordController = async (req, res) => {
	const { email } = req.body;
	const otp = Math.floor(Math.random() * 1000000);

	// checking whether the user even have previously done sign up or not
	const user = await User.findOne({ where: { email } });
	if (user) {
		const forgetPasswordRequest = await ForgotPasswordRequest.create({
			ExpenseUserId: user.id,
			otp,
		});

		try {
			if (forgetPasswordRequest) {
				// setting up transporter for my gmail service
				const transporter = nodemailer.createTransport({
					service: "gmail",
					auth: {
						user: process.env.nodemailer_user,
						pass: process.env.nodemailer_pass,
					},
				});

				// preparing the email message which will be sent
				const mailOptions = {
					from: process.env.nodemailer_user,
					to: email,
					subject:
						"Hello from Nodemailer, Enter this otp to change your password",
					text: `${otp}`,
					// You can also use HTML for the email body
					// html: '<h1>This is the body of the email</h1>'
				};

				// sending the email when user will hit this api
				transporter.sendMail(mailOptions, (error, info) => {
					if (error) {
						return res.json({ error: error.message });
					} else {
						return res.json({
							message: "Mail sent successfully",
							forgetPasswordRequest,
						});
					}
				});
			}
		} catch (error) {
			return res.json({ error: error.message });
		}
	} else {
		return res.json({ error: "You aren't a registerd user" });
	}
};

// first post request which will be fired when the user will click on the sent link through the email just to check whether the link is still active or not
const passwordResettingController = async (req, res) => {
	const { requestId } = req.params;

	try {
		const isRequestExists = await ForgotPasswordRequest.findOne({
			where: { id: requestId },
		});
		if (isRequestExists.isActive === true) {
			return res.send({ isAbleToResetPassword: true });
		} else {
			return res.send({ isAbleToResetPassword: false });
		}
	} catch (error) {
		return res.json({ error: error.message });
	}
};

// second post request which completely handles the password resetting logic
const confirmResetPasswordController = async (req, res) => {
	const { requestId, password } = req.body;

	try {
		// finding the user whose password is supposed to be reset
		const isRequestExists = await ForgotPasswordRequest.findOne({
			where: { id: requestId },
		});
		const isUserExists = await User.findOne({
			where: { id: isRequestExists.ExpenseUserId },
		});

		if (!isUserExists) return res.json({ error: "User not found" });
		// checking if the user is using the same previous password or not
		const isPrevious = await bcrypt.compare(
			password,
			isUserExists.password,
		);
		if (isPrevious)
			return res.json({
				error: "password can't be same as the previous one",
			});
		// if the user exists then need to hash his new password before updating with the old one
		const hashedPassword = await bcrypt.hash(password, saltRounds);
		// now updating the new password with the old password
		await isUserExists.update({ password: hashedPassword });
		// now after successful updation we need to change the password reset request isActive status from true to false so that when user next time clicks on the same password resetting link it will throw him an error saying that the password reset link is not active/expired
		// finding that password reset request
		const passwordResetRequest = await ForgotPasswordRequest.findOne({
			where: { id: requestId },
		});
		// now updating the status of isActive field of this requst from true to false
		await passwordResetRequest.update({ isActive: false });
		return res.json({ message: "Password updated successfully" });
	} catch (error) {
		return res.json({ error: error.message });
	}
};

module.exports = {
	sendEmailForResettingPasswordController,
	passwordResettingController,
	confirmResetPasswordController,
};
