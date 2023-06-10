/** @format */

/* This code is requiring the OrderModel from the models folder in order to use it in the current file. */
const Order = require("../models/OrderModel");
/* This code is importing the "UserModel" from the "models" folder. This code is likely used to access the user data stored in the UserModel file, such as user information, preferences, and more. */
const User = require("../models/UserModel");
/* This code is importing the bcryptjs library, which provides an API for hashing and salting passwords in order to keep them secure. */
const bcrypt = require("bcryptjs");
/* This code is setting the variable saltRounds to the value of 12. SaltRounds is typically used as part of a hashing algorithm to increase the security of passwords stored in a database. The higher the number, the more secure the password storage. */
const saltRounds = 12;
/* This code is requiring the "Database" module from the "../database" directory and assigning it to the "sequelize" variable. It is likely being used to connect to a database, such as MySQL, and interact with it. */
const sequelize = require("../database/Database");

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
		/* This code is using the bcrypt library to generate a hashed version of the provided password. The saltRounds parameter is used to increase the complexity of the generated hash, making it more difficult to crack. */
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

		const order = await Order.findAll({
			where: { ExpenseUserId: user.id, status: "completed" },
			attributes: ["orderId", "paymentId", "status"],
		});

		if (order.length > 0) {
			const orders = order.map((o) => ({
				orderId: o.orderId,
				paymentId: o.paymentId,
				status: o.status,
			}));
			return res.json({
				message: "User login successfull",
				user: {
					id: user.id,
					name: user.name,
					email: user.email,
					totalExpenses: user.totalExpenses,
					orderId: orders[0].orderId,
					paymentId: orders[0].paymentId,
					status: orders[0].status,
				},
			});
		} else {
			// User login successful
			return res.json({
				message: "User login successful",
				user: {
					id: user.id,
					name: user.name,
					email: user.email,
					totalExpenses: user.totalExpenses,
					orderId: "",
					paymentId: "",
					status: "",
				},
			});
		}
	} catch (error) {
		res.json({ error: "Internal server error" });
	}
};

module.exports = { registrationController, loginController };
