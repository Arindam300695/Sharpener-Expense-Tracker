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
/* This code is creating a transaction with the sequelize database. This will ensure that any errors that occur during API calls will not be reflected in the database. */
const registrationController = async (req, res) => {
	// need to do the sequelize transaction so that if any error occurs during api calls then that should not get reflected in the database
	const transaction = await sequelize.transaction();
	try {
		const { name, email, password } = req.body;

		// Check if user already exists
		/* This code is attempting to find a user in the database with a given email address. It is using the User model to query the database and find a user with the specified email address. */
		const existingUser = await User.findOne({ where: { email } });
		if (existingUser) {
			return res.json({ error: "User already exists" });
		}

		// hashing the password
		/* This code is using the bcrypt library to generate a hashed version of the provided password. The saltRounds parameter is used to increase the complexity of the generated hash, making it more difficult to crack. */
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		// Create a new user
		/* This code is creating a new user record in the database with the specified name, email, and a hashed password. The transaction parameter is used to ensure that the user record is created in a single atomic action. */
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
/* This code is a function called loginController which is used to handle user login requests. It takes two parameters, req and res, which are objects representing the request and response respectively. It then extracts the email and password from the request body and stores them in variables. */
const loginController = async (req, res) => {
	const { email, password } = req.body;

	try {
		// Check if user with the provided email exists
		/* This code is using the await keyword to find a user in the database with the given email address. It is using the User object to query the database and find a user with the specified email address. */
		const user = await User.findOne({ where: { email } });

		if (!user) {
			return res.json({ error: "User not found" });
		}

		// Compare password
		/* This code is using the bcrypt library to compare the provided password with the user's stored password. If the passwords match, the boolean value 'true' is assigned to the variable 'passwordMatch'. */
		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			return res.json({ error: "User not authorized" });
		}

		/* This code is finding all orders associated with a particular user by their UserId, and then selecting only certain attributes (orderId, paymentId, and status) to be returned. The status must be "completed" for the order to be included in the results. */
		const order = await Order.findAll({
			where: { ExpenseUserId: user.id, status: "completed" },
			attributes: ["orderId", "paymentId", "status"],
		});

		if (order.length > 0) {
			/* This code is mapping through the "order" array and creating a new array of objects containing the "orderId", "paymentId", and "status" properties. The new array of objects is then stored in the "orders" variable. */
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
