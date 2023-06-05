/** @format */

const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const saltRounds = 12;

// registration controller
const registrationController = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		// Check if user already exists
		const existingUser = await User.findOne({ where: { email } });
		if (existingUser) {
			return res.json({ error: "User already exists" });
		}

		// hashing the password
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		// Create a new user
		const user = await User.create({
			name,
			email,
			password: hashedPassword,
		});

		return res.json({ message: "Signup successful", user });
	} catch (error) {
		return res.json({ error: "Server error" });
	}
};

// login controller
const loginController = async (req, res) => {
	const { email, password } = req.body;

	try {
		// Check if user with the provided email exists
		const user = await User.findOne({ where: { email } });

		if (!user) {
			return res.json({ error: "User not found" });
		}

		// Compare password
		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			return res.json({ error: "User not authorized" });
		}

		// User login successful
		res.json({ message: "User login successful", user });
	} catch (error) {
		res.json({ error: "Internal server error" });
	}
};

module.exports = { registrationController, loginController };
