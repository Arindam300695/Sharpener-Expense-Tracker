/** @format */

const User = require("../models/UserModel");

const registrationController = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		// Check if user already exists
		const existingUser = await User.findOne({ where: { email } });
		if (existingUser) {
			return res.status(409).json({ message: "User already exists" });
		}

		// Create a new user
		const user = await User.create({ name, email, password });

		return res.status(201).json({ message: "Signup successful", user });
	} catch (error) {
		console.error("Error during signup:", error);
		return res.status(500).json({ message: "Server error" });
	}
};

module.exports = { registrationController };
