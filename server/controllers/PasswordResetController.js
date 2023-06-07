/** @format */

const sequelize = require("../database/Database");
const nodemailer = require("nodemailer");
require("dotenv").config();

const passwordResetController = async (req, res) => {
	const { email } = req.body;

	try {
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
			subject: "Hello from Nodemailer, This is just a dummy email",
			text: "This is the body of the email",
			// You can also use HTML for the email body
			// html: '<h1>This is the body of the email</h1>'
		};

		// sending the email when user will hit this api
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return res.json({ error: error.message });
			} else {
				return res.json({ message: "Mail sent successfully" });
			}
		});
	} catch (error) {
		return res.json({ error: error.message });
	}
};

module.exports = passwordResetController;
