/** @format */

const Order = require("../models/OrderModel");
const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const saltRounds = 12;

// registration controller
const registrationController = async (req, res) => {
	// need to do the sequelize transaction so that if any error occurs during api calls then that should not get reflected in the database
	const transaction = await sequelize.transaction();
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
		const user = await User.create(
			{
				name,
				email,
				password: hashedPassword,
			},
			{ transaction },
		);
		await transaction.commit();
		return res.json({ message: "Signup successful", user });
	} catch (error) {
		await transaction.rollback();
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
			where: { UserId: user.id, status: "completed" },
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
