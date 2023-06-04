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
			return res.status(409).json({ message: "User already exists" });
		}

		// hashing the password
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		// Create a new user
		const user = await User.create({
			name,
			email,
			password: hashedPassword,
		});

		return res.status(201).json({ message: "Signup successful", user });
	} catch (error) {
		console.error("Error during signup:", error);
		return res.status(500).json({ message: "Server error" });
	}
};

// login controller
const loginController = async (req, res) => {
	const { email, password } = req.body;

	try {
		// Check if user with the provided email exists
		const user = await User.findOne({ where: { email } });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Compare password
		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			return res.status(401).json({ message: "User not authorized" });
		}

		// User login successful
		res.status(200).json({ message: "User login successful" });
	} catch (error) {
		console.error("Error during login:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

module.exports = { registrationController, loginController };
